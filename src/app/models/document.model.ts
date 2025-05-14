export interface ValidatedDocumentDTO {
  id: string;
  name: string;
  creationTime: string;
  sizeBytes: number;
  validationStats?: {
    totalChecks: number;
    passedChecks: number;
    failedChecks: number;
    durationMs: number;
    commentsCount: number;
    fixCount: number;
  };
}