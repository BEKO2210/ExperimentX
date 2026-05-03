import type { SkepticalReview } from '../domain/skepticalReview';

export function SkepticalReviewPanel({ review }: { review: SkepticalReview }) {
  return (
    <section aria-labelledby="skeptical-review-heading">
      <h3 id="skeptical-review-heading">Skeptical Review (Run 019)</h3>
      <p>{review.summary}</p>
      {review.warnings.length > 0 ? (
        <ul>
          {review.warnings.map((warning) => <li key={warning}>{warning}</li>)}
        </ul>
      ) : (
        <p>No automatic warnings.</p>
      )}
    </section>
  );
}
