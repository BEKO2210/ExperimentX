import type { TargetImage } from './experiment';

export function importTargetPool(json: string): TargetImage[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }
  if (!Array.isArray(parsed) || parsed.length < 4) {
    throw new Error('Target pool must be an array with at least 4 items');
  }
  const targets = parsed as TargetImage[];
  const ids = new Set<string>();
  for (const t of targets) {
    if (!t.id || !t.title || !t.imageUrl) throw new Error('Each target needs id, title, imageUrl');
    if (ids.has(t.id)) throw new Error('Duplicate target id detected');
    ids.add(t.id);
  }
  return targets;
}

export function exportTargetPool(targets: TargetImage[]): string {
  return JSON.stringify(targets, null, 2);
}
