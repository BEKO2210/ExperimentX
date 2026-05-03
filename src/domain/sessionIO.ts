import type { Session, Trial } from './experiment';

export function exportSession(session: Session): string {
  return JSON.stringify(session, null, 2);
}

export function importSession(json: string): Session {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!isSession(parsed)) {
    throw new Error('JSON does not match Session schema');
  }
  return parsed;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

function isTrial(value: unknown, candidatesPerTrial: number): value is Trial {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  if (typeof t.id !== 'string' || typeof t.createdAt !== 'string' || typeof t.actualTargetId !== 'string') return false;
  if (!isStringArray(t.candidateIds) || t.candidateIds.length !== candidatesPerTrial) return false;
  if (!t.candidateIds.includes(t.actualTargetId)) return false;
  if (t.ranking !== undefined) {
    if (!isStringArray(t.ranking) || t.ranking.length !== candidatesPerTrial) return false;
  }
  if (t.confidence !== undefined && (typeof t.confidence !== 'number' || t.confidence < 0 || t.confidence > 100)) return false;
  return true;
}

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  if (
    typeof s.id !== 'string' ||
    typeof s.createdAt !== 'string' ||
    typeof s.protocolVersion !== 'string' ||
    typeof s.candidatesPerTrial !== 'number' ||
    s.candidatesPerTrial < 2 ||
    s.candidatesPerTrial > 12 ||
    !Array.isArray(s.trials)
  ) {
    return false;
  }

  return s.trials.every((trial) => isTrial(trial, s.candidatesPerTrial as number));
}
