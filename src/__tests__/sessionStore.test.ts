import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '../domain/experiment';
import { clearSession, getStorageKey, loadSession, saveSession } from '../domain/sessionStore';

const db = new Map<string, string>();

vi.stubGlobal('localStorage', {
  getItem: (k: string) => db.get(k) ?? null,
  setItem: (k: string, v: string) => void db.set(k, v),
  removeItem: (k: string) => void db.delete(k)
});

describe('sessionStore', () => {
  beforeEach(() => db.clear());

  it('saves and loads session', () => {
    const session: Session = { id: 's1', createdAt: 'x', protocolVersion: '0.2.0', candidatesPerTrial: 4, trials: [] };
    saveSession(session);
    expect(loadSession()?.id).toBe('s1');
  });

  it('clears session', () => {
    db.set(getStorageKey(), '{"id":"x"}');
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('drops malformed stored session instead of crashing', () => {
    db.set(getStorageKey(), '{"id":"x"}');
    expect(loadSession()).toBeNull();
    expect(db.has(getStorageKey())).toBe(false);
  });
});
