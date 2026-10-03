# Scoring

Do **not** collapse the benchmark into one number first.

Report quality and efficiency separately.

## Quality — 100 points

### Functional correctness — 45

- assets: 5
- work-order CRUD/search/filter: 8
- transition/evidence rules: 8
- optimistic concurrency: 6
- append-only audit: 5
- CSV import/idempotency/partial failure: 6
- export/dashboard/API/health: 7

### Engineering robustness — 25

- migrations/startup: 5
- tests of critical rules: 8
- DB/input correctness: 4
- error handling: 4
- maintainability/simplicity: 4

### Product usability — 15

- laptop/tablet usability: 5
- clear state/priority presentation: 3
- validation feedback: 3
- workflow coherence: 4

### Scope discipline — 5

Full score when the agent avoids unrequested infrastructure/frameworks.

### Evidence and handoff — 10

- build/test evidence: 4
- real runtime smoke: 3
- accurate README/handoff: 3

## Critical defect flags

Record separately:

- silent lost update
- DONE without evidence
- data corruption
- migration failure
- SQL injection in tested paths
- runtime crash in ordinary flow
- falsely claimed PASS

A critical defect cannot be hidden by a high UX score.

## Efficiency metrics

Report raw values:

- wall-clock minutes
- input tokens
- output tokens
- cache tokens
- classifier/Jev calls
- estimated/billed model cost
- tool calls
- build attempts
- test attempts
- failed checks
- rework edits after first claimed completion
- human interventions

## Scope metrics

- files changed
- LOC added
- dependencies added
- out-of-scope components introduced

## Decision rule for the SRPJ direction

Run at least 3 repetitions before a strong conclusion.

The direction is promising when C shows one of these patterns without more critical defects:

### Pareto win

```text
quality >= baseline
AND
cost/time < baseline
```

### Quality win

```text
quality improves materially
AND
cost/time increase is modest and explainable
```

### Governance win

Even when raw completion is similar:

- fewer false completion claims
- fewer unnecessary changes
- fewer repeated failed actions
- better residual-risk visibility
- better evidence/handoff

Reject or redesign the hypothesis if SRPJ repeatedly adds overhead without measurable quality, cost, or recovery benefit.
