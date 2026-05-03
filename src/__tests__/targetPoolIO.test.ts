import { describe, expect, it } from 'vitest';
import { exportTargetPool, importTargetPool } from '../domain/targetPoolIO';

describe('targetPoolIO', () => {
  it('imports valid pool', () => {
    const json = JSON.stringify([
      { id: '1', title: 'A', imageUrl: 'x' },
      { id: '2', title: 'B', imageUrl: 'x' },
      { id: '3', title: 'C', imageUrl: 'x' },
      { id: '4', title: 'D', imageUrl: 'x' }
    ]);
    expect(importTargetPool(json)).toHaveLength(4);
  });

  it('rejects duplicates', () => {
    const json = JSON.stringify([
      { id: '1', title: 'A', imageUrl: 'x' },
      { id: '1', title: 'B', imageUrl: 'x' },
      { id: '3', title: 'C', imageUrl: 'x' },
      { id: '4', title: 'D', imageUrl: 'x' }
    ]);
    expect(() => importTargetPool(json)).toThrowError(/Duplicate/);
  });

  it('exports JSON', () => {
    const out = exportTargetPool([{ id: '1', title: 'A', imageUrl: 'x' }]);
    expect(out).toContain('"id": "1"');
  });
});
