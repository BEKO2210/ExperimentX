# ExperimentX Release v0.1.1 (Post-v0.1 Bugfix)

Date: 2026-05-03

## Focus
Post-release hardening based on review feedback: stricter session JSON import validation.

## Changes
- `importSession` now validates trial-level structure, including:
  - candidate count matching `candidatesPerTrial`
  - `actualTargetId` must be present in candidate list
  - ranking length must match `candidatesPerTrial` when ranking exists
  - confidence range constrained to 0-100
- Added regression tests for invalid import payloads.

## Why this matters
This reduces acceptance of malformed data and strengthens reproducibility/auditability of imported sessions.

## Validation
- `npm test`
- `npm run build`
