import type { Session } from './experiment';

const KEY = 'experimentx:session-history:v1';

export function loadSessionHistory(): Session[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Session[];
  } catch {
    return [];
  }
}

export function appendSessionHistory(session: Session): void {
  const history = loadSessionHistory();
  const deduped = [session, ...history.filter((s) => s.id !== session.id)].slice(0, 50);
  localStorage.setItem(KEY, JSON.stringify(deduped));
}

export function clearSessionHistory(): void {
  localStorage.removeItem(KEY);
}
