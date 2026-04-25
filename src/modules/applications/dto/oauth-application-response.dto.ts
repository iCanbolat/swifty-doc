import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/http/pagination.dto';
import {
  OAUTH_APPLICATION_STATUS_VALUES,
  OAUTH_APPLICATION_TYPE_VALUES,
} from '../applications.types';

export class OAuthApplicationDataDto {
  @ApiProperty({ example: 'oauth_app_123' })
  id!: string;

  @ApiProperty({ example: 'org_123' })
  organizationId!: string;

  @ApiProperty({ example: 'SwiftyDoc Partner App' })
  name!: string;

  @ApiPropertyOptional({
    example: 'Internal onboarding automation client.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: 'swd_client_1f4f7846b76a4f91a1b4817dfadad8d2' })
  clientId!: string;

  @ApiProperty({
    type: String,
    isArray: true,
    example: ['https://partner.example.com/oauth/callback'],
  })
  redirectUris!: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    example: ['requests.read', 'requests.write', 'files.read'],
  })
  allowedScopes!: string[];

  @ApiProperty({
    enum: OAUTH_APPLICATION_TYPE_VALUES,
    enumName: 'OAuthApplicationType',
    example: 'confidential',
  })
  applicationType!: (typeof OAUTH_APPLICATION_TYPE_VALUES)[number];

  @ApiProperty({
    enum: OAUTH_APPLICATION_STATUS_VALUES,
    enumName: 'OAuthApplicationStatus',
    example: 'active',
  })
  status!: (typeof OAUTH_APPLICATION_STATUS_VALUES)[number];

  @ApiProperty({ example: true })
  hasClientSecret!: boolean;

  @ApiProperty({ example: '2026-04-22T16:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-22T16:00:00.000Z' })
  updatedAt!: string;
}

export class OAuthApplicationResponseDto {
  @ApiProperty({ type: () => OAuthApplicationDataDto })
  data!: OAuthApplicationDataDto;
}

export class OAuthApplicationListResponseDto {
  @ApiProperty({ type: () => OAuthApplicationDataDto, isArray: true })
  data!: OAuthApplicationDataDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
