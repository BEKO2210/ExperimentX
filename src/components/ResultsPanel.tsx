import { formatPercent, interpretResult, type ConfidenceSummary, wilsonInterval95 } from '../domain/statistics';

export function ResultsPanel({
  hits,
  total,
  chance,
  pValue,
  confidence,
  effectSizeH
}: {
  hits: number;
  total: number;
  chance: number;
  pValue: number;
  confidence?: ConfidenceSummary;
  effectSizeH?: number;
}) {
  const hitRate = total === 0 ? 0 : hits / total;
  const ci = wilsonInterval95(hits, total);
  const interpretation = interpretResult(pValue, hitRate, chance);

  return (
    <section aria-live="polite" aria-labelledby="results-heading">
      <h3 id="results-heading">Session Results</h3>
      <p>Hits: {hits} / {total}</p>
      <p>Hit rate: {formatPercent(hitRate)}</p>
      <p>Chance expectation: {formatPercent(chance)}</p>
      <p>95% CI (Wilson): {formatPercent(ci.low)} to {formatPercent(ci.high)}</p>
      <p>Binomial p-value P(X ≥ hits | chance): {pValue.toFixed(4)}</p>
      {typeof effectSizeH === 'number' && <p>Effect size (Cohen's h vs chance): {effectSizeH.toFixed(3)}</p>}
      {confidence && (
        <>
          <p>Mean confidence: {confidence.meanConfidence.toFixed(1)} / 100</p>
          <p>Mean confidence on hits: {confidence.meanHitConfidence.toFixed(1)} / 100</p>
          <p>Mean confidence on misses: {confidence.meanMissConfidence.toFixed(1)} / 100</p>
        </>
      )}
      <p><strong>Interpretation:</strong> {interpretation}</p>
      <p>Exploratory only. Does not prove paranormal perception or non-local consciousness. Requires replication.</p>
    </section>
  );
}
