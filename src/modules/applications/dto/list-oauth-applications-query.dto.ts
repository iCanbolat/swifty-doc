import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';
import {
  OAUTH_APPLICATION_STATUS_VALUES,
  OAUTH_APPLICATION_TYPE_VALUES,
  type OAuthApplicationStatus,
  type OAuthApplicationType,
} from '../applications.types';

export class ListOAuthApplicationsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'partner', maxLength: 160 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  search?: string;

  @ApiPropertyOptional({
    enum: OAUTH_APPLICATION_STATUS_VALUES,
    enumName: 'OAuthApplicationStatus',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(OAUTH_APPLICATION_STATUS_VALUES)
  status?: OAuthApplicationStatus;

  @ApiPropertyOptional({
    enum: OAUTH_APPLICATION_TYPE_VALUES,
    enumName: 'OAuthApplicationType',
    example: 'confidential',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(OAUTH_APPLICATION_TYPE_VALUES)
  applicationType?: OAuthApplicationType;
}
