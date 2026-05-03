export function shuffle<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickCandidates<T>(items: T[], count: number, rng: () => number = Math.random): T[] {
  if (count > items.length) {
    throw new Error(`Cannot pick ${count} items from pool of ${items.length}`);
  }
  return shuffle(items, rng).slice(0, count);
}

export function pickOne<T>(items: T[], rng: () => number = Math.random): T {
  if (items.length === 0) {
    throw new Error('Cannot pick one item from empty array');
  }
  return items[Math.floor(rng() * items.length)];
}
