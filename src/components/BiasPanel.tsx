import { computeCandidateDistribution, imbalanceScore } from '../domain/bias';
import type { Session } from '../domain/experiment';

export function BiasPanel({ session }: { session: Session }) {
  const rows = computeCandidateDistribution(session);
  const shownImbalance = imbalanceScore(rows.map((r) => r.shownCount));
  const targetImbalance = imbalanceScore(rows.map((r) => r.targetCount));

  return (
    <section aria-labelledby="bias-heading">
      <h3 id="bias-heading">Bias Controls (Run 009)</h3>
      <p>Shown-count imbalance: {shownImbalance.toFixed(3)}</p>
      <p>Target-count imbalance: {targetImbalance.toFixed(3)}</p>
      <table>
        <thead>
          <tr><th scope="col">Candidate</th><th scope="col">Shown</th><th scope="col">As target</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.candidateId}><td>{r.candidateId}</td><td>{r.shownCount}</td><td>{r.targetCount}</td></tr>
          ))}
        </tbody>
      </table>
      <p>Exploratory diagnostic only. Large imbalance suggests checking pool size, trial count, or RNG assumptions.</p>
    </section>
  );
}
