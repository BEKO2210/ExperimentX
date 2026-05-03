import { describe, expect, it } from 'vitest';
import { computeCandidateDistribution, imbalanceScore } from '../domain/bias';
import type { Session } from '../domain/experiment';

describe('bias', () => {
  it('computes candidate distribution', () => {
    const session: Session = {
      id: 's', createdAt: '', protocolVersion: 'x', candidatesPerTrial: 4, trials: [
        { id: 't1', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a' },
        { id: 't2', createdAt: '', candidateIds: ['a', 'b', 'e', 'f'], actualTargetId: 'e' }
      ]
    };
    const rows = computeCandidateDistribution(session);
    expect(rows.find((r) => r.candidateId === 'a')?.shownCount).toBe(2);
    expect(rows.find((r) => r.candidateId === 'e')?.targetCount).toBe(1);
  });

  it('imbalance score is zero for uniform', () => {
    expect(imbalanceScore([2, 2, 2, 2])).toBe(0);
  });
});
