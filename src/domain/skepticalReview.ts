import type { Session } from './experiment';
import { computeCandidateDistribution, imbalanceScore } from './bias';
import { scoreSession, binomialProbabilityAtLeast } from './statistics';

export interface SkepticalReview {
  warnings: string[];
  summary: string;
}

export function generateSkepticalReview(session: Session): SkepticalReview {
  const warnings: string[] = [];
  const scored = scoreSession(session);
  const pValue = binomialProbabilityAtLeast(scored.hits, scored.totalTrials, scored.expectedChanceRate);

  if (scored.totalTrials < 20) {
    warnings.push('Small sample size: fewer than 20 trials can produce unstable hit-rate fluctuations.');
  }

  const incomplete = session.trials.filter((t) => !t.completedAt || !t.ranking || t.ranking.length !== session.candidatesPerTrial).length;
  if (incomplete > 0) {
    warnings.push(`Protocol deviation: ${incomplete} trial(s) appear incomplete or non-compliant.`);
  }

  const distribution = computeCandidateDistribution(session);
  const shownImbalance = imbalanceScore(distribution.map((d) => d.shownCount));
  const targetImbalance = imbalanceScore(distribution.map((d) => d.targetCount));
  if (shownImbalance > 0.25 || targetImbalance > 0.25) {
    warnings.push('Randomization imbalance detected: candidate exposure/target frequencies are notably uneven.');
  }

  if (scored.hitRate > scored.expectedChanceRate && pValue >= 0.05) {
    warnings.push('Above-chance trend is statistically weak (p ≥ 0.05) and compatible with chance fluctuation.');
  }

  if (!session.preregistration) {
    warnings.push('No preregistration metadata found; interpret outcomes as flexible exploratory evidence only.');
  }

  if (!session.auditLog || session.auditLog.length < scored.totalTrials) {
    warnings.push('Sparse audit log: event trace may be insufficient for independent procedural review.');
  }

  return {
    warnings,
    summary: warnings.length === 0
      ? 'No major red flags were auto-detected, but findings still require independent replication.'
      : `Skeptical review flagged ${warnings.length} potential risk factor(s).`
  };
}
