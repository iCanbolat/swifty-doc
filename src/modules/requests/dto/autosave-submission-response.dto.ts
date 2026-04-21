import { ApiProperty } from '@nestjs/swagger';
import { SUBMISSION_STATUS_VALUES } from '../../../common/requests/request-workflow';

export class AutosaveSubmissionResponseDataDto {
  @ApiProperty({ example: 'submission_123' })
  submissionId!: string;

  @ApiProperty({
    enum: SUBMISSION_STATUS_VALUES,
    enumName: 'SubmissionStatus',
    example: 'in_progress',
  })
  status!: (typeof SUBMISSION_STATUS_VALUES)[number];

  @ApiProperty({ example: 64 })
  progressPercent!: number;

  @ApiProperty({ example: 3 })
  answeredItems!: number;

  @ApiProperty({ example: 10 })
  totalItems!: number;

  @ApiProperty({ example: 6 })
  completedItems!: number;

  @ApiProperty({ example: '2026-04-21T10:50:00.000Z' })
  updatedAt!: string;
}

export class AutosaveSubmissionResponseDto {
  @ApiProperty({ type: () => AutosaveSubmissionResponseDataDto })
  data!: AutosaveSubmissionResponseDataDto;
}
