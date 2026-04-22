import type { ExportJobType } from '../../common/exports/export-types';

export interface CreateExportJobInput {
  organizationId: string;
  exportType: ExportJobType;
  requestId?: string;
  submissionId?: string;
  requestedByUserId?: string;
  includeFiles?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ExportGenerationJobPayload {
  exportJobId: string;
  organizationId: string;
}

export interface GeneratedArtifact {
  buffer: Buffer;
  extension: 'zip' | 'pdf' | 'csv';
  mimeType: 'application/zip' | 'application/pdf' | 'text/csv';
}

export interface FileAssetExportRow {
  fileId: string;
  requestId: string | null;
  submissionId: string | null;
  submissionItemId: string | null;
  originalFileName: string;
  normalizedFileName: string;
  detectedMimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  storageKey: string;
  createdAt: Date;
}