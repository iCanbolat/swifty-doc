import { ApiProperty } from '@nestjs/swagger';
import { IntegrationConnectionDataDto } from './integration-connection-response.dto';
import { TriggerSyncJobResponseDataDto } from './trigger-sync-job-response.dto';
import {
  INTEGRATION_AUTH_TYPE_VALUES,
  INTEGRATION_PROVIDER_KEY_VALUES,
} from '../../../common/integrations/integration-types';
import { INTEGRATION_PROVIDER_CATEGORY_VALUES } from '../integrations.constants';

export class IntegrationProviderDebugDto {
  @ApiProperty({
    enum: INTEGRATION_PROVIDER_KEY_VALUES,
    enumName: 'IntegrationProviderKey',
    example: 'google_drive',
  })
  key!: (typeof INTEGRATION_PROVIDER_KEY_VALUES)[number];

  @ApiProperty({ example: 'Google Drive' })
  displayName!: string;

  @ApiProperty({
    enum: INTEGRATION_PROVIDER_CATEGORY_VALUES,
    enumName: 'IntegrationProviderCategory',
    example: 'storage',
  })
  category!: (typeof INTEGRATION_PROVIDER_CATEGORY_VALUES)[number];

  @ApiProperty({
    enum: INTEGRATION_AUTH_TYPE_VALUES,
    enumName: 'IntegrationAuthType',
    example: 'oauth2',
  })
  authType!: (typeof INTEGRATION_AUTH_TYPE_VALUES)[number];

  @ApiProperty({ example: true })
  supportsConnectionTesting!: boolean;

  @ApiProperty({ example: true })
  supportsManualSync!: boolean;
}

export class IntegrationExternalReferenceDebugDto {
  @ApiProperty({ example: 'integration_external_ref_123' })
  id!: string;

  @ApiProperty({ example: 'export_job' })
  localResourceType!: string;

  @ApiProperty({ example: 'export_job_123' })
  localResourceId!: string;

  @ApiProperty({ example: 'export_artifact' })
  externalObjectType!: string;

  @ApiProperty({ example: '1AbCdEfGhIjKlMnOp' })
  externalId!: string;

  @ApiProperty({ example: null, nullable: true })
  externalReferenceKey!: string | null;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      remoteFileUrl: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOp/view',
    },
  })
  metadata!: Record<string, unknown>;

  @ApiProperty({ example: '2026-04-22T17:12:00.000Z' })
  lastSyncedAt!: string;

  @ApiProperty({ example: '2026-04-22T17:10:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-22T17:12:00.000Z' })
  updatedAt!: string;
}

export class IntegrationDebugDataDto {
  @ApiProperty({ type: () => IntegrationConnectionDataDto })
  connection!: IntegrationConnectionDataDto;

  @ApiProperty({ type: () => IntegrationProviderDebugDto })
  provider!: IntegrationProviderDebugDto;

  @ApiProperty({ type: () => TriggerSyncJobResponseDataDto, isArray: true })
  recentSyncJobs!: TriggerSyncJobResponseDataDto[];

  @ApiProperty({
    type: () => IntegrationExternalReferenceDebugDto,
    isArray: true,
  })
  externalReferences!: IntegrationExternalReferenceDebugDto[];
}

export class IntegrationDebugResponseDto {
  @ApiProperty({ type: () => IntegrationDebugDataDto })
  data!: IntegrationDebugDataDto;
}
