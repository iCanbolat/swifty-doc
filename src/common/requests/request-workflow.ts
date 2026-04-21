export const REQUEST_STATUS_VALUES = [
  'draft',
  'sent',
  'in_progress',
  'completed',
  'closed',
  'cancelled',
] as const;

export type RequestStatus = (typeof REQUEST_STATUS_VALUES)[number];

export const REQUEST_TRANSITION_ACTION_VALUES = [
  'send',
  'close',
  'reopen',
] as const;

export type RequestTransitionAction =
  (typeof REQUEST_TRANSITION_ACTION_VALUES)[number];

export const SUBMISSION_STATUS_VALUES = [
  'in_progress',
  'completed',
  'reopened',
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS_VALUES)[number];

export const SUBMISSION_ITEM_STATUS_VALUES = [
  'pending',
  'provided',
  'approved',
  'rejected',
  'changes_requested',
] as const;

export type SubmissionItemStatus =
  (typeof SUBMISSION_ITEM_STATUS_VALUES)[number];
