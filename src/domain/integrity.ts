import type { Session } from './experiment';

export interface SessionIntegrityRecord {
  algorithm: 'SHA-256';
  canonicalSessionJson: string;
  sessionHash: string;
  createdAt: string;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

function sanitizeSession(session: Session): Record<string, unknown> {
  const clone = structuredClone(session) as unknown as Record<string, unknown>;
  delete clone.integrity;
  return clone;
}

export function canonicalizeSession(session: Session): string {
  return stableStringify(sanitizeSession(session));
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createIntegrityRecord(session: Session): Promise<SessionIntegrityRecord> {
  const canonicalSessionJson = canonicalizeSession(session);
  const sessionHash = await sha256Hex(canonicalSessionJson);
  return {
    algorithm: 'SHA-256',
    canonicalSessionJson,
    sessionHash,
    createdAt: new Date().toISOString()
  };
}

export async function verifyIntegrityRecord(record: SessionIntegrityRecord): Promise<boolean> {
  const recomputed = await sha256Hex(record.canonicalSessionJson);
  return recomputed === record.sessionHash;
}
