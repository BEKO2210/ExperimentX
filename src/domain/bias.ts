import type { Session } from './experiment';

export interface CandidateDistribution {
  candidateId: string;
  shownCount: number;
  targetCount: number;
}

export function computeCandidateDistribution(session: Session): CandidateDistribution[] {
  const shown = new Map<string, number>();
  const target = new Map<string, number>();

  for (const trial of session.trials) {
    for (const id of trial.candidateIds) {
      shown.set(id, (shown.get(id) ?? 0) + 1);
    }
    target.set(trial.actualTargetId, (target.get(trial.actualTargetId) ?? 0) + 1);
  }

  return [...shown.keys()]
    .sort()
    .map((id) => ({
      candidateId: id,
      shownCount: shown.get(id) ?? 0,
      targetCount: target.get(id) ?? 0
    }));
}

export function imbalanceScore(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const avgAbsDeviation = values.reduce((sum, v) => sum + Math.abs(v - mean), 0) / values.length;
  return avgAbsDeviation / mean;
}
