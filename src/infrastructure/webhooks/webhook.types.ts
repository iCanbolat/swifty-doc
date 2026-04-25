import type { PaginationParams } from '../../common/http/pagination.dto';
import type {
  WebhookEventType,
  WebhookSubscriptionType,
} from '../../common/webhooks/webhook-events';
import type { WebhookDeliveryStatus } from '../../common/webhooks/webhook-delivery-types';

export interface ListWebhookEndpointsInput {
  organizationId: string;
  pagination: PaginationParams;
  search?: string;
}

export interface ListWebhookDeliveriesInput {
  organizationId: string;
  pagination: PaginationParams;
  endpointId?: string;
  status?: WebhookDeliveryStatus;
}

export interface WebhookEndpointRecord {
  id: string;
  organizationId: string;
  url: string;
  secret: string;
  subscribedEvents: WebhookSubscriptionType[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookEventEnvelope {
  id: string;
  type: WebhookEventType;
  occurred_at: string;
  organization_id?: string;
  data: Record<string, unknown>;
}

export interface WebhookDeliveryRecord {
  id: string;
  organizationId: string;
  endpointId: string;
  endpointUrl: string;
  eventId: string;
  eventType: string;
  requestBody: Record<string, unknown>;
  status: WebhookDeliveryStatus;
  attemptCount: number;
  responseCode: number | null;
  lastErrorMessage: string | null;
  sourceDeliveryId: string | null;
  lastAttemptedAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDeliveryJobPayload {
  deliveryId: string;
}
