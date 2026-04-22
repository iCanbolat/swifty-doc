export type UploadedByType = 'user' | 'recipient' | 'system';

export interface UploadBase64Input {
  contentBase64: string;
  contentType?: string;
  fileName: string;
  organizationId: string;
  requestId?: string;
  submissionId?: string;
  submissionItemId?: string;
  uploadedByType?: UploadedByType;
  uploadedById?: string;
  metadata?: Record<string, unknown>;
}