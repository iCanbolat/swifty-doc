import { ApiProperty } from '@nestjs/swagger';
import { REQUEST_STATUS_VALUES } from '../../../common/requests/request-workflow';

export class TransitionRequestResponseDataDto {
  @ApiProperty({ example: 'req_123' })
  id!: string;

  @ApiProperty({
    enum: REQUEST_STATUS_VALUES,
    enumName: 'RequestStatus',
    example: 'sent',
  })
  status!: (typeof REQUEST_STATUS_VALUES)[number];

  @ApiProperty({ nullable: true, example: '2026-04-21T10:30:00.000Z' })
  sentAt!: string | null;

  @ApiProperty({ nullable: true, example: null })
  closedAt!: string | null;

  @ApiProperty({ example: '2026-04-21T10:30:00.000Z' })
  updatedAt!: string;
}

export class TransitionRequestResponseDto {
  @ApiProperty({ type: () => TransitionRequestResponseDataDto })
  data!: TransitionRequestResponseDataDto;
}
