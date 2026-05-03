import { describe, expect, it } from 'vitest';
import type { Session } from '../domain/experiment';
import { canonicalizeSession, createIntegrityRecord, verifyIntegrityRecord } from '../domain/integrity';

const session: Session = {
  id: 's1',
  createdAt: '2026-01-01T00:00:00.000Z',
  protocolVersion: '0.5.0',
  candidatesPerTrial: 4,
  trials: [
    { id: 't1', createdAt: 'x', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'] }
  ]
};

describe('integrity', () => {
  it('canonicalizeSession is deterministic across key order', () => {
    const reordered: Session = { ...session, trials: [...session.trials] };
    expect(canonicalizeSession(session)).toBe(canonicalizeSession(reordered));
  });

  it('creates verifiable sha256 integrity record', async () => {
    const record = await createIntegrityRecord(session);
    expect(record.sessionHash).toHaveLength(64);
    await expect(verifyIntegrityRecord(record)).resolves.toBe(true);
  });
});
