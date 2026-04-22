import type {
  RequestStatus,
  RequestTransitionAction,
} from '../../common/requests/request-workflow';

export const TRANSITION_RULES: Record<
  RequestTransitionAction,
  readonly RequestStatus[]
> = {
  send: ['draft'],
  close: ['sent', 'in_progress', 'completed'],
  reopen: ['closed'],
};

export const PORTAL_DEFAULT_EXPIRES_IN_MINUTES = 60 * 24 * 7;