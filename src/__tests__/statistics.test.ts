import { describe, expect, it } from 'vitest';
import { aggregateSessions, binomialProbabilityAtLeast, cohensHForProportions, interpretResult, scoreSession, scoreTrial, summarizeConfidence, wilsonInterval95 } from '../domain/statistics';
import type { Session, Trial } from '../domain/experiment';

describe('statistics', () => {
  it('scoreTrial counts hit only for rank 1', () => {
    const trial: Trial = { id: '1', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'b', ranking: ['b', 'a', 'c', 'd'] };
    const miss: Trial = { ...trial, id: '2', ranking: ['a', 'b', 'c', 'd'] };
    expect(scoreTrial(trial).hit).toBe(true);
    expect(scoreTrial(miss).hit).toBe(false);
  });

  it('scoreSession computes hit rate', () => {
    const session: Session = {
      id: 's',
      createdAt: '',
      protocolVersion: '0.1',
      candidatesPerTrial: 4,
      trials: [
        { id: '1', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'] },
        { id: '2', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'b', ranking: ['a', 'b', 'c', 'd'] }
      ]
    };
    const result = scoreSession(session);
    expect(result.hits).toBe(1);
    expect(result.hitRate).toBe(0.5);
  });

  it('binomialProbabilityAtLeast deterministic plausibility', () => {
    const value = binomialProbabilityAtLeast(10, 40, 0.25);
    expect(value).toBeGreaterThan(0.45);
    expect(value).toBeLessThan(0.65);
  });

  it('wilson interval is bounded', () => {
    const ci = wilsonInterval95(5, 10);
    expect(ci.low).toBeGreaterThanOrEqual(0);
    expect(ci.high).toBeLessThanOrEqual(1);
    expect(ci.high).toBeGreaterThan(ci.low);
  });

  it('interpretation stays conservative', () => {
    const text = interpretResult(0.03, 0.35, 0.25);
    expect(text.toLowerCase()).toContain('exploratory');
  });

  it('summarizeConfidence separates hit and miss confidence', () => {
    const session: Session = {
      id: 's2', createdAt: '', protocolVersion: '0.1', candidatesPerTrial: 4,
      trials: [
        { id: '1', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'], confidence: 80 },
        { id: '2', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'b', ranking: ['a', 'b', 'c', 'd'], confidence: 20 }
      ]
    };
    const c = summarizeConfidence(session);
    expect(c.meanHitConfidence).toBe(80);
    expect(c.meanMissConfidence).toBe(20);
  });

  it('cohens h is zero when observed equals expected', () => {
    expect(cohensHForProportions(0.25, 0.25)).toBeCloseTo(0, 10);
  });

  it('aggregateSessions combines trials and hits', () => {
    const s1: Session = { id: 'a', createdAt: '', protocolVersion: '0.1', candidatesPerTrial: 4, trials: [
      { id: '1', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'] }
    ] };
    const s2: Session = { id: 'b', createdAt: '', protocolVersion: '0.1', candidatesPerTrial: 4, trials: [
      { id: '2', createdAt: '', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'b', ranking: ['a', 'b', 'c', 'd'] }
    ] };
    const agg = aggregateSessions([s1, s2]);
    expect(agg.sessions).toBe(2);
    expect(agg.totalTrials).toBe(2);
    expect(agg.hits).toBe(1);
    expect(agg.hitRate).toBe(0.5);
  });
});
