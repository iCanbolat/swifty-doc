import { ApiProperty } from '@nestjs/swagger';
import { REQUEST_STATUS_VALUES } from '../../../common/requests/request-workflow';

export class CreateRequestResponseDataDto {
  @ApiProperty({ example: 'req_123' })
  id!: string;

  @ApiProperty({ example: 'org_123' })
  organizationId!: string;

  @ApiProperty({ example: 'ws_123' })
  workspaceId!: string;

  @ApiProperty({ example: 'client_123' })
  clientId!: string;

  @ApiProperty({ example: 'tpl_123' })
  templateId!: string;

  @ApiProperty({ example: 'tpl_ver_001' })
  templateVersionId!: string;

  @ApiProperty({ example: 'REQ-MGUEI3-R9A31F82' })
  requestCode!: string;

  @ApiProperty({ example: 'KYC onboarding - ACME Ltd' })
  title!: string;

  @ApiProperty({
    enum: REQUEST_STATUS_VALUES,
    enumName: 'RequestStatus',
    example: 'draft',
  })
  status!: (typeof REQUEST_STATUS_VALUES)[number];

  @ApiProperty({ nullable: true, example: '2026-05-05T09:30:00.000Z' })
  dueAt!: string | null;

  @ApiProperty({ nullable: true, example: null })
  sentAt!: string | null;

  @ApiProperty({ nullable: true, example: null })
  closedAt!: string | null;

  @ApiProperty({ example: '2026-04-21T09:15:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-21T09:15:00.000Z' })
  updatedAt!: string;

  @ApiProperty({ example: 2 })
  createdSubmissionCount!: number;
}

export class CreateRequestResponseDto {
  @ApiProperty({ type: () => CreateRequestResponseDataDto })
  data!: CreateRequestResponseDataDto;
}
