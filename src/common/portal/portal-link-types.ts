export const PORTAL_LINK_PURPOSE_VALUES = [
  'request_access',
  'submission_access',
] as const;

export type PortalLinkPurpose = (typeof PORTAL_LINK_PURPOSE_VALUES)[number];

export const PORTAL_LINK_STATUS_VALUES = [
  'active',
  'consumed',
  'revoked',
  'expired',
] as const;

export type PortalLinkStatus = (typeof PORTAL_LINK_STATUS_VALUES)[number];
