import { describe, expect, it } from 'vitest';
import type { Session } from '../domain/experiment';
import { exportSession, importSession } from '../domain/sessionIO';

describe('sessionIO', () => {
  it('exports and imports session JSON', () => {
    const session: Session = {
      id: 's1',
      createdAt: 'now',
      protocolVersion: '0.5.0',
      candidatesPerTrial: 4,
      preregistration: {
        plannedTrials: 10,
        candidatesPerTrial: 4,
        hypothesis: 'Exploratory above-chance check',
        exclusionRules: 'Exclude incomplete trials',
        registeredAt: 'now'
      },
      stateProtocol: { mood: 60, stress: 40, fatigue: 30, preparationMinutes: 10, notes: 'ok', recordedAt: 'now' },
      trials: [
        { id: 't1', createdAt: 'now', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a', 'b', 'c', 'd'], confidence: 50 }
      ]
    };
    const json = exportSession(session);
    const imported = importSession(json);
    expect(imported.preregistration?.plannedTrials).toBe(10);
    expect(imported.stateProtocol?.mood).toBe(60);
  });

  it('throws on invalid structure', () => {
    expect(() => importSession('{"foo":1}')).toThrowError(/schema/);
  });

  it('rejects trial with candidate count mismatch', () => {
    const bad = {
      id: 's', createdAt: 'x', protocolVersion: '0.5', candidatesPerTrial: 4,
      trials: [{ id: 't1', createdAt: 'x', candidateIds: ['a', 'b'], actualTargetId: 'a' }]
    };
    expect(() => importSession(JSON.stringify(bad))).toThrowError(/schema/);
  });

  it('rejects ranking with invalid length', () => {
    const bad = {
      id: 's', createdAt: 'x', protocolVersion: '0.5', candidatesPerTrial: 4,
      trials: [{ id: 't1', createdAt: 'x', candidateIds: ['a', 'b', 'c', 'd'], actualTargetId: 'a', ranking: ['a'] }]
    };
    expect(() => importSession(JSON.stringify(bad))).toThrowError(/schema/);
  });
});
