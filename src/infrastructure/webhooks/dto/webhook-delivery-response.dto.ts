import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WEBHOOK_DELIVERY_STATUS_VALUES } from '../../../common/webhooks/webhook-delivery-types';

export class WebhookDeliveryViewDto {
  @ApiProperty({ example: 'webhook_delivery_123' })
  id!: string;

  @ApiProperty({ example: 'org_123' })
  organizationId!: string;

  @ApiProperty({ example: 'webhook_endpoint_123' })
  endpointId!: string;

  @ApiProperty({ example: 'https://partner.example.com/hooks/swiftydoc' })
  endpointUrl!: string;

  @ApiProperty({ example: 'evt_123' })
  eventId!: string;

  @ApiProperty({ example: 'request.completed' })
  eventType!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      id: 'evt_123',
      type: 'request.completed',
      organization_id: 'org_123',
      occurred_at: '2026-04-22T17:05:00.000Z',
      data: {
        requestId: 'req_123',
        status: 'completed',
      },
    },
  })
  requestBody!: Record<string, unknown>;

  @ApiProperty({
    enum: WEBHOOK_DELIVERY_STATUS_VALUES,
    enumName: 'WebhookDeliveryStatus',
    example: 'failed',
  })
  status!: (typeof WEBHOOK_DELIVERY_STATUS_VALUES)[number];

  @ApiProperty({ example: 2 })
  attemptCount!: number;

  @ApiPropertyOptional({ example: 500, nullable: true })
  responseCode!: number | null;

  @ApiPropertyOptional({
    example: 'Webhook delivery failed with status 500.',
    nullable: true,
  })
  lastErrorMessage!: string | null;

  @ApiPropertyOptional({ example: 'webhook_delivery_122', nullable: true })
  sourceDeliveryId!: string | null;

  @ApiPropertyOptional({ example: '2026-04-22T17:05:02.000Z', nullable: true })
  lastAttemptedAt!: string | null;

  @ApiPropertyOptional({ example: '2026-04-22T17:05:03.000Z', nullable: true })
  deliveredAt!: string | null;

  @ApiProperty({ example: '2026-04-22T17:05:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-04-22T17:05:03.000Z' })
  updatedAt!: string;
}

export class WebhookDeliveryResponseDto {
  @ApiProperty({ type: () => WebhookDeliveryViewDto })
  data!: WebhookDeliveryViewDto;
}

export class WebhookDeliveryListResponseDto {
  @ApiProperty({ type: () => WebhookDeliveryViewDto, isArray: true })
  data!: WebhookDeliveryViewDto[];
}
