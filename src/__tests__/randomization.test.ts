import { describe, expect, it } from 'vitest';
import { pickCandidates, shuffle } from '../domain/randomization';

const rng = (() => {
  const values = [0.1, 0.8, 0.3, 0.6, 0.2, 0.5];
  let idx = 0;
  return () => values[idx++ % values.length];
})();

describe('randomization', () => {
  it('shuffle does not mutate input', () => {
    const input = [1, 2, 3, 4];
    const clone = [...input];
    shuffle(input, rng);
    expect(input).toEqual(clone);
  });

  it('pickCandidates returns count and unique elements', () => {
    const out = pickCandidates(['a', 'b', 'c', 'd', 'e'], 4, rng);
    expect(out).toHaveLength(4);
    expect(new Set(out).size).toBe(4);
  });
});
