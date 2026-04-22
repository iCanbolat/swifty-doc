import type {
  ReminderChannel,
  ReminderProvider,
} from '../../common/reminders/reminder-types';

export interface UpsertReminderProviderConfigInput {
  organizationId: string;
  channel: ReminderChannel;
  provider: ReminderProvider;
  enabled?: boolean;
  config?: Record<string, unknown>;
}

export interface UpsertBrandingSettingsInput {
  organizationId: string;
  displayName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  emailFromName?: string;
  emailReplyTo?: string;
  metadata?: Record<string, unknown>;
}

export interface UpsertEmailTemplateVariantInput {
  organizationId: string;
  templateKey: string;
  locale?: string;
  resendTemplateId?: string;
  subjectTemplate: string;
  bodyTemplate: string;
  metadata?: Record<string, unknown>;
}