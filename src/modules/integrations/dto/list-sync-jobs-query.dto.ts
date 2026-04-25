import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/http/pagination.dto';
import {
  SYNC_JOB_STATUS_VALUES,
  SYNC_JOB_TYPE_VALUES,
  type SyncJobStatus,
  type SyncJobType,
} from '../../../common/integrations/integration-types';

export class ListSyncJobsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 'integration_connection_123',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  connectionId?: string;

  @ApiPropertyOptional({
    enum: SYNC_JOB_STATUS_VALUES,
    enumName: 'SyncJobStatus',
    example: 'succeeded',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(SYNC_JOB_STATUS_VALUES)
  status?: SyncJobStatus;

  @ApiPropertyOptional({
    enum: SYNC_JOB_TYPE_VALUES,
    enumName: 'SyncJobType',
    example: 'manual_sync',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(SYNC_JOB_TYPE_VALUES)
  jobType?: SyncJobType;
}
