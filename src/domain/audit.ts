export type AuditEventType =
  | 'session_started'
  | 'session_imported'
  | 'target_pool_imported'
  | 'impression_saved'
  | 'ranking_submitted'
  | 'session_completed';

export interface AuditEvent {
  at: string;
  type: AuditEventType;
  details?: Record<string, string | number | boolean>;
}

export function appendAuditEvent<T extends { auditLog?: AuditEvent[] }>(
  state: T,
  type: AuditEventType,
  details?: Record<string, string | number | boolean>
): T {
  const event: AuditEvent = Object.freeze({
    at: new Date().toISOString(),
    type,
    details: details ? Object.freeze({ ...details }) : undefined
  });

  return {
    ...state,
    auditLog: [...(state.auditLog ?? []), event]
  };
}
