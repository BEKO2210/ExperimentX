import type { Session } from './experiment';

export function createReplicationProtocolId(session: Session): string {
  const prereg = session.preregistration;
  if (!prereg) {
    return `rx-v${session.protocolVersion}-c${session.candidatesPerTrial}`;
  }
  return [
    `rx-v${session.protocolVersion}`,
    `t${prereg.plannedTrials}`,
    `c${prereg.candidatesPerTrial}`,
    prereg.hypothesis.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 24)
  ].join('-');
}

export function sameReplicationProtocol(a: Session, b: Session): boolean {
  return (
    a.candidatesPerTrial === b.candidatesPerTrial &&
    a.preregistration?.plannedTrials === b.preregistration?.plannedTrials &&
    a.preregistration?.candidatesPerTrial === b.preregistration?.candidatesPerTrial &&
    (a.preregistration?.hypothesis ?? '').trim() === (b.preregistration?.hypothesis ?? '').trim() &&
    (a.preregistration?.exclusionRules ?? '').trim() === (b.preregistration?.exclusionRules ?? '').trim()
  );
}

export function countReplications(reference: Session, sessions: Session[]): number {
  return sessions.filter((s) => s.id !== reference.id && sameReplicationProtocol(reference, s)).length;
}
