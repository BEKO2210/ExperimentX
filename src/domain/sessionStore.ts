import type { Session } from './experiment';
import { importSession } from './sessionIO';

const STORAGE_KEY = 'experimentx.activeSession.v1';

export function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return importSession(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStorageKey(): string {
  return STORAGE_KEY;
}
