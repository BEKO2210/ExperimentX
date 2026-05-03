import { describe, expect, it } from 'vitest';
import { appendAuditEvent } from '../domain/audit';

describe('audit', () => {
  it('appends immutable timestamped events', () => {
    const state = { auditLog: [] };
    const next = appendAuditEvent(state, 'session_started', { plannedTrials: 10 });
    expect(next.auditLog?.length).toBe(1);
    expect(next.auditLog?.[0]).toHaveProperty('at');
    expect(next.auditLog?.[0]).toHaveProperty('type', 'session_started');
  });
});
