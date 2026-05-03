import type { Session, SessionResult, Trial, TrialResult } from './experiment';

export interface AggregateSessionResult {
  sessions: number;
  totalTrials: number;
  hits: number;
  hitRate: number;
  expectedChanceRate: number;
  pValue: number;
  effectSizeH: number;
}

export interface ConfidenceSummary {
  meanConfidence: number;
  meanHitConfidence: number;
  meanMissConfidence: number;
}

export function scoreTrial(trial: Trial): TrialResult {
  const ranking = trial.ranking ?? [];
  const actualRank = ranking.indexOf(trial.actualTargetId);
  return {
    trialId: trial.id,
    hit: ranking[0] === trial.actualTargetId,
    actualRank: actualRank >= 0 ? actualRank + 1 : undefined
  };
}

export function scoreSession(session: Session): SessionResult {
  const results = session.trials.map(scoreTrial);
  const hits = results.filter((r) => r.hit).length;
  const totalTrials = results.length;
  return {
    totalTrials,
    hits,
    hitRate: totalTrials === 0 ? 0 : hits / totalTrials,
    expectedChanceRate: 1 / session.candidatesPerTrial,
    results
  };
}

export function summarizeConfidence(session: Session): ConfidenceSummary {
  const scored = session.trials.map((trial) => ({ hit: scoreTrial(trial).hit, confidence: trial.confidence ?? 0 }));
  const mean = (vals: number[]) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);
  return {
    meanConfidence: mean(scored.map((s) => s.confidence)),
    meanHitConfidence: mean(scored.filter((s) => s.hit).map((s) => s.confidence)),
    meanMissConfidence: mean(scored.filter((s) => !s.hit).map((s) => s.confidence))
  };
}

function binomialCoefficient(n: number, k: number): number {
  let result = 1;
  const m = Math.min(k, n - k);
  for (let i = 1; i <= m; i += 1) {
    result *= (n - (m - i));
    result /= i;
  }
  return result;
}

function binomialProbabilityExactly(k: number, n: number, p: number): number {
  return binomialCoefficient(n, k) * p ** k * (1 - p) ** (n - k);
}

export function binomialProbabilityAtLeast(k: number, n: number, p: number): number {
  if (n < 0 || k < 0 || k > n || p < 0 || p > 1) {
    throw new Error('Invalid binomial parameters');
  }
  let sum = 0;
  for (let i = k; i <= n; i += 1) {
    sum += binomialProbabilityExactly(i, n, p);
  }
  return sum;
}

export function wilsonInterval95(hits: number, total: number): { low: number; high: number } {
  if (total <= 0) return { low: 0, high: 0 };
  const z = 1.96;
  const phat = hits / total;
  const denom = 1 + (z ** 2 / total);
  const center = (phat + z ** 2 / (2 * total)) / denom;
  const margin = (z * Math.sqrt((phat * (1 - phat) + z ** 2 / (4 * total)) / total)) / denom;
  return { low: Math.max(0, center - margin), high: Math.min(1, center + margin) };
}

export function interpretResult(pValue: number, hitRate: number, chanceRate: number): string {
  if (hitRate <= chanceRate) return 'Observed performance is at or below chance in this session. Negative and null results are informative.';
  if (pValue < 0.01) return 'Statistically interesting (exploratory) signal in this session. Requires preregistered replication and stronger controls.';
  if (pValue < 0.05) return 'Mild above-chance signal in this session. Treat as exploratory only and replicate before interpretation.';
  return 'Above-chance trend is weak in this session and compatible with chance fluctuation. Replication required.';
}



export function cohensHForProportions(observedRate: number, expectedRate: number): number {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const p1 = clamp(observedRate);
  const p2 = clamp(expectedRate);
  return 2 * Math.asin(Math.sqrt(p1)) - 2 * Math.asin(Math.sqrt(p2));
}

export function aggregateSessions(sessions: Session[]): AggregateSessionResult {
  const scored = sessions.map(scoreSession);
  const totalTrials = scored.reduce((acc, cur) => acc + cur.totalTrials, 0);
  const hits = scored.reduce((acc, cur) => acc + cur.hits, 0);
  const expectedChanceRate = scored.length > 0 ? scored[0].expectedChanceRate : 0;
  const hitRate = totalTrials === 0 ? 0 : hits / totalTrials;
  const pValue = totalTrials === 0 ? 1 : binomialProbabilityAtLeast(hits, totalTrials, expectedChanceRate);
  const effectSizeH = cohensHForProportions(hitRate, expectedChanceRate);
  return { sessions: sessions.length, totalTrials, hits, hitRate, expectedChanceRate, pValue, effectSizeH };
}
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
