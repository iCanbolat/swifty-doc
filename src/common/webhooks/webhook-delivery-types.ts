export const WEBHOOK_DELIVERY_STATUS_VALUES = [
  'queued',
  'delivered',
  'failed',
] as const;

export type WebhookDeliveryStatus =
  (typeof WEBHOOK_DELIVERY_STATUS_VALUES)[number];
