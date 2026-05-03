import { describe, expect, it } from 'vitest';
import type { Session } from '../domain/experiment';
import { countReplications, createReplicationProtocolId, sameReplicationProtocol } from '../domain/replication';

const mk = (id: string, hypothesis = 'H', exclusion = 'E'): Session => ({
  id,
  createdAt: 'now',
  protocolVersion: '0.5.0',
  candidatesPerTrial: 4,
  preregistration: { plannedTrials: 10, candidatesPerTrial: 4, hypothesis, exclusionRules: exclusion, registeredAt: 'now' },
  trials: []
});

describe('replication', () => {
  it('creates stable protocol id from session design', () => {
    const id = createReplicationProtocolId(mk('a', 'Exploratory trial', 'Exclude incomplete'));
    expect(id).toContain('rx-v0.5.0');
    expect(id).toContain('t10');
  });

  it('matches only same protocol sessions', () => {
    const ref = mk('ref', 'A', 'B');
    const same = mk('s1', 'A', 'B');
    const diff = mk('s2', 'A2', 'B');
    expect(sameReplicationProtocol(ref, same)).toBe(true);
    expect(sameReplicationProtocol(ref, diff)).toBe(false);
    expect(countReplications(ref, [same, diff])).toBe(1);
  });
});
