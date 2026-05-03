# ExperimentX Release v0.1.0

Date: 2026-05-03

## Scope
This release provides a local, browser-based exploratory research tool for controlled target-identification experiments.

## Included capabilities
- Preregistration inputs and structured session setup
- Two-step double-blind-oriented trial flow (impression -> ranking)
- Session import/export and target-pool import/export
- Statistical reporting (hit rate, chance baseline, binomial p-value, Wilson CI, Cohen's h)
- Confidence tracking and multi-session local aggregation
- Replication mode metadata and protocol matching
- Audit trail, randomization diagnostics, skeptical review warnings
- Integrity hashing (SHA-256 canonical session hash)

## Safety and claim policy
- No medical or dangerous protocol support
- No proof claims about paranormal or metaphysical theories
- Results are exploratory and replication-dependent

## Validation run
- `npm test`
- `npm run build`
- `npm run build:pages`

## Known limitations
- Client-only storage by default (local browser)
- No server-side identity, consent workflow, or cryptographic signing service
- Statistical outputs are exploratory helpers, not confirmatory inference pipelines
