import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/http/pagination.dto';
import { TriggerSyncJobResponseDataDto } from './trigger-sync-job-response.dto';

export class ListSyncJobsResponseDto {
  @ApiProperty({ type: () => TriggerSyncJobResponseDataDto, isArray: true })
  data!: TriggerSyncJobResponseDataDto[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}
