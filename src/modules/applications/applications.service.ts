import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { desc, eq, and } from 'drizzle-orm';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { AUDIT_ACTIONS } from '../../common/audit/audit-actions';
import { RESOURCE_TYPES } from '../../common/audit/resource-types';
import { AuditLogService } from '../../infrastructure/audit/audit-log.service';
import { DatabaseService } from '../../infrastructure/database/database.service';
import { oauthApplications } from '../../infrastructure/database/schema';
import type {
  CreateOAuthApplicationInput,
  OAuthApplicationCredentialResult,
  OAuthApplicationRecord,
  OAuthApplicationStatus,
  RotateOAuthApplicationSecretInput,
  UpdateOAuthApplicationInput,
} from './applications.types';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly databaseService: DatabaseService,
  ) {}

  async listApplications(
    organizationId: string,
  ): Promise<OAuthApplicationRecord[]> {
    const db = this.getDatabase();

    return db
      .select()
      .from(oauthApplications)
      .where(eq(oauthApplications.organizationId, organizationId))
      .orderBy(desc(oauthApplications.createdAt));
  }

  async getApplication(
    applicationId: string,
    organizationId: string,
  ): Promise<OAuthApplicationRecord> {
    const db = this.getDatabase();
    const [application] = await db
      .select()
      .from(oauthApplications)
      .where(
        and(
          eq(oauthApplications.id, applicationId),
          eq(oauthApplications.organizationId, organizationId),
        ),
      )
      .limit(1);

    if (!application) {
      throw new NotFoundException('OAuth application not found.');
    }

    return application;
  }

  async createApplication(
    input: CreateOAuthApplicationInput,
  ): Promise<OAuthApplicationCredentialResult> {
    const db = this.getDatabase();
    const now = new Date();
    const applicationId = randomUUID();
    const clientId = this.generateClientId();
    const applicationType = input.applicationType ?? 'confidential';
    const clientSecret =
      applicationType === 'confidential' ? this.generateClientSecret() : null;

    try {
      const [application] = await db
        .insert(oauthApplications)
        .values({
          id: applicationId,
          organizationId: input.organizationId,
          name: input.name.trim(),
          description: this.normalizeOptionalString(input.description) ?? null,
          clientId,
          clientSecretHash: clientSecret ? this.hashSecret(clientSecret) : null,
          redirectUris: this.normalizeStringArray(input.redirectUris),
          allowedScopes: this.normalizeStringArray(input.allowedScopes),
          applicationType,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      await this.auditLogService.record({
        category: 'data_access',
        channel: 'api',
        action: AUDIT_ACTIONS.data_access.oauthApplicationCreated,
        organizationId: application.organizationId,
        actorId: input.actorUserId,
        actorType: input.actorUserId ? 'user' : undefined,
        resourceType: RESOURCE_TYPES.identity.oauthApplication,
        resourceId: application.id,
        metadata: {
          applicationType: application.applicationType,
          clientId: application.clientId,
          hasClientSecret: clientSecret !== null,
        },
      });

      return {
        application,
        clientSecret,
      };
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new BadRequestException(
          'Invalid organization reference for OAuth application.',
        );
      }

      throw error;
    }
  }

  async updateApplication(
    applicationId: string,
    input: UpdateOAuthApplicationInput,
  ): Promise<OAuthApplicationRecord> {
    const currentApplication = await this.getApplication(
      applicationId,
      input.organizationId,
    );
    const db = this.getDatabase();
    const nextApplicationType =
      input.applicationType ?? currentApplication.applicationType;
    const now = new Date();
    const [application] = await db
      .update(oauthApplications)
      .set({
        name: input.name?.trim() ?? currentApplication.name,
        description:
          input.description !== undefined
            ? (this.normalizeOptionalString(input.description) ?? null)
            : currentApplication.description,
        redirectUris:
          input.redirectUris !== undefined
            ? this.normalizeStringArray(input.redirectUris)
            : currentApplication.redirectUris,
        allowedScopes:
          input.allowedScopes !== undefined
            ? this.normalizeStringArray(input.allowedScopes)
            : currentApplication.allowedScopes,
        applicationType: nextApplicationType,
        status: (input.status ??
          currentApplication.status) as OAuthApplicationStatus,
        clientSecretHash:
          nextApplicationType === 'public'
            ? null
            : currentApplication.clientSecretHash,
        updatedAt: now,
      })
      .where(eq(oauthApplications.id, currentApplication.id))
      .returning();

    await this.auditLogService.record({
      category: 'data_access',
      channel: 'api',
      action: AUDIT_ACTIONS.data_access.oauthApplicationUpdated,
      organizationId: application.organizationId,
      actorId: input.actorUserId,
      actorType: input.actorUserId ? 'user' : undefined,
      resourceType: RESOURCE_TYPES.identity.oauthApplication,
      resourceId: application.id,
      metadata: {
        applicationType: application.applicationType,
        status: application.status,
      },
    });

    return application;
  }

  async rotateApplicationSecret(
    applicationId: string,
    input: RotateOAuthApplicationSecretInput,
  ): Promise<OAuthApplicationCredentialResult> {
    const currentApplication = await this.getApplication(
      applicationId,
      input.organizationId,
    );

    if (currentApplication.applicationType !== 'confidential') {
      throw new BadRequestException(
        'Only confidential OAuth applications can rotate client secrets.',
      );
    }

    const clientSecret = this.generateClientSecret();
    const db = this.getDatabase();
    const now = new Date();
    const [application] = await db
      .update(oauthApplications)
      .set({
        clientSecretHash: this.hashSecret(clientSecret),
        updatedAt: now,
      })
      .where(eq(oauthApplications.id, currentApplication.id))
      .returning();

    await this.auditLogService.record({
      category: 'data_access',
      channel: 'api',
      action: AUDIT_ACTIONS.data_access.oauthApplicationSecretRotated,
      organizationId: application.organizationId,
      actorId: input.actorUserId,
      actorType: input.actorUserId ? 'user' : undefined,
      resourceType: RESOURCE_TYPES.identity.oauthApplication,
      resourceId: application.id,
      metadata: {
        clientId: application.clientId,
      },
    });

    return {
      application,
      clientSecret,
    };
  }

  sanitizeApplication(application: OAuthApplicationRecord) {
    return {
      ...application,
      hasClientSecret: application.clientSecretHash !== null,
    };
  }

  private generateClientId(): string {
    return `swd_client_${randomUUID().replace(/-/g, '')}`;
  }

  private generateClientSecret(): string {
    return `swd_secret_${randomBytes(16).toString('hex')}`;
  }

  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  private normalizeStringArray(values: string[] | undefined): string[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  }

  private normalizeOptionalString(
    value: string | undefined,
  ): string | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private getDatabase() {
    if (!this.databaseService.isConfigured()) {
      throw new ServiceUnavailableException(
        'Database is not configured for OAuth application operations.',
      );
    }

    return this.databaseService.db;
  }

  private isForeignKeyViolation(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (
      'code' in error &&
      typeof error.code === 'string' &&
      error.code === '23503'
    );
  }
}
