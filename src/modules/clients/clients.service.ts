import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import {
  PaginatedResult,
  paginateResult,
} from '../../common/http/pagination.dto';
import { AUDIT_ACTIONS } from '../../common/audit/audit-actions';
import { RESOURCE_TYPES } from '../../common/audit/resource-types';
import { AuditLogService } from '../../infrastructure/audit/audit-log.service';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { clients } from '../../infrastructure/database/schema';
import type {
  ClientRecord,
  CreateClientInput,
  ListClientsInput,
  UpdateClientInput,
} from './clients.types';

@Injectable()
export class ClientsService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly databaseService: DatabaseService,
  ) {}

  async listClients(
    input: ListClientsInput,
  ): Promise<PaginatedResult<ClientRecord>> {
    const db = this.getDatabase();
    const conditions = [
      eq(clients.organizationId, input.organizationId),
      eq(clients.workspaceId, input.workspaceId),
    ];

    if (input.status) {
      conditions.push(eq(clients.status, input.status));
    }

    const search = this.normalizeOptionalString(input.search);

    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(clients.displayName, pattern),
        ilike(clients.legalName, pattern),
        ilike(clients.externalRef, pattern),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const [countRows, items] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(clients)
        .where(and(...conditions)),
      db
        .select()
        .from(clients)
        .where(and(...conditions))
        .orderBy(desc(clients.createdAt), desc(clients.id))
        .limit(input.pagination.pageSize)
        .offset(input.pagination.offset),
    ]);

    return paginateResult(items, countRows[0]?.count ?? 0, input.pagination);
  }

  async getClient(
    clientId: string,
    organizationId: string,
  ): Promise<ClientRecord> {
    const db = this.getDatabase();
    const [client] = await db
      .select()
      .from(clients)
      .where(
        and(
          eq(clients.id, clientId),
          eq(clients.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return client;
  }

  async createClient(input: CreateClientInput): Promise<ClientRecord> {
    const db = this.getDatabase();
    const now = new Date();

    try {
      const [client] = await db
        .insert(clients)
        .values({
          id: randomUUID(),
          organizationId: input.organizationId,
          workspaceId: input.workspaceId,
          displayName: input.displayName.trim(),
          legalName: this.normalizeOptionalString(input.legalName) ?? null,
          externalRef: this.normalizeOptionalString(input.externalRef) ?? null,
          status: 'active',
          metadata: input.metadata ?? {},
          createdAt: now,
          updatedAt: now,
          archivedAt: null,
        })
        .returning();

      await this.auditLogService.record({
        category: 'data_access',
        channel: 'api',
        action: AUDIT_ACTIONS.data_access.clientCreated,
        organizationId: client.organizationId,
        actorId: input.actorUserId,
        actorType: 'user',
        resourceType: RESOURCE_TYPES.documents.client,
        resourceId: client.id,
        metadata: {
          workspaceId: client.workspaceId,
          externalRef: client.externalRef,
        },
      });

      return client;
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException(
          'Invalid workspace reference for client creation.',
        );
      }

      if (this.isUniqueViolation(error, 'clients_workspace_external_ref_key')) {
        throw new BadRequestException(
          'Client externalRef must be unique within a workspace.',
        );
      }

      throw error;
    }
  }

  async updateClient(
    clientId: string,
    input: UpdateClientInput,
  ): Promise<ClientRecord> {
    const currentClient = await this.getClient(clientId, input.organizationId);
    const db = this.getDatabase();
    const now = new Date();

    try {
      const [client] = await db
        .update(clients)
        .set({
          displayName: input.displayName?.trim() ?? currentClient.displayName,
          legalName:
            input.legalName !== undefined
              ? (this.normalizeOptionalString(input.legalName) ?? null)
              : currentClient.legalName,
          externalRef:
            input.externalRef !== undefined
              ? (this.normalizeOptionalString(input.externalRef) ?? null)
              : currentClient.externalRef,
          status: input.status ?? currentClient.status,
          metadata: input.metadata ?? currentClient.metadata,
          updatedAt: now,
          archivedAt:
            input.status === 'archived'
              ? (currentClient.archivedAt ?? now)
              : input.status === 'active'
                ? null
                : currentClient.archivedAt,
        })
        .where(eq(clients.id, currentClient.id))
        .returning();

      await this.auditLogService.record({
        category: 'data_access',
        channel: 'api',
        action: AUDIT_ACTIONS.data_access.clientUpdated,
        organizationId: client.organizationId,
        actorId: input.actorUserId,
        actorType: 'user',
        resourceType: RESOURCE_TYPES.documents.client,
        resourceId: client.id,
        metadata: {
          status: client.status,
          workspaceId: client.workspaceId,
        },
      });

      return client;
    } catch (error) {
      if (this.isUniqueViolation(error, 'clients_workspace_external_ref_key')) {
        throw new BadRequestException(
          'Client externalRef must be unique within a workspace.',
        );
      }

      throw error;
    }
  }

  serializeClient(client: ClientRecord) {
    return {
      ...client,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      archivedAt: client.archivedAt?.toISOString() ?? null,
    };
  }

  private normalizeOptionalString(
    value: string | undefined,
  ): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private getDatabase() {
    if (!this.databaseService.isConfigured()) {
      throw new ServiceUnavailableException(
        'Database is not configured for client operations.',
      );
    }

    return this.databaseService.db;
  }

  private isForeignKeyViolation(error: unknown): boolean {
    return (
      !!error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code === '23503'
    );
  }

  private isUniqueViolation(error: unknown, constraint: string): boolean {
    return (
      !!error &&
      typeof error === 'object' &&
      'code' in error &&
      typeof error.code === 'string' &&
      error.code === '23505' &&
      'constraint' in error &&
      error.constraint === constraint
    );
  }
}
