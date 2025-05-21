export interface AuditLogDTO {
  id: bigint;
  user_id: bigint;
  action: string;
  entity_type: string;
  entity_id: bigint;
  timestamp: string;
}

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  action?: string;
  entityType?: string;
}