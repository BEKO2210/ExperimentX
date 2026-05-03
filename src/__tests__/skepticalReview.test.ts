import { describe, expect, it } from 'vitest';
import type { Session } from '../domain/experiment';
import { generateSkepticalReview } from '../domain/skepticalReview';

function makeSession(overrides: Partial<Session> = {}): Session {
  return {
    id: 's',
    createdAt: 'now',
    protocolVersion: '0.5.0',
    candidatesPerTrial: 4,
    trials: [
      { id: 't1', createdAt: 'now', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'], completedAt: 'now' }
    ],
    preregistration: { plannedTrials: 1, candidatesPerTrial: 4, hypothesis: 'h', exclusionRules: 'e', registeredAt: 'now' },
    auditLog: [{ type: 'session_started', at: 'now' }],
    ...overrides
  };
}

describe('skepticalReview', () => {
  it('flags small samples', () => {
    const review = generateSkepticalReview(makeSession());
    expect(review.warnings.join(' ')).toContain('Small sample size');
  });

  it('flags missing preregistration', () => {
    const review = generateSkepticalReview(makeSession({ preregistration: undefined }));
    expect(review.warnings.join(' ')).toContain('No preregistration');
  });
});
