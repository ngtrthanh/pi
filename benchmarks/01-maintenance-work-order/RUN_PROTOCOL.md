# Run protocol

## Fairness

Each variant starts from:

- the same empty Git repository;
- identical copies of `TASK.md`, `ACCEPTANCE.md`, and `fixtures/work_orders.csv`;
- the same machine class;
- the same network policy;
- no previous conversation;
- no hidden project files.

The evaluator is **not** placed in the agent workspace until the run is finished.

## Run variants

### A — Vanilla

Use a fixed chosen frontier model.

Record the exact physical model.

### B — Spiral

Use the same physical model as A.

Load the risk-PDCA extension.

### C — SRPJ

Load risk-PDCA + Jev router and use `jev/auto`.

Record every actual physical model used.

## Human intervention

After the task is submitted:

- do not give implementation hints;
- do not fix code manually;
- only approve actions that the benchmark policy permits;
- record every human intervention.

## Stop conditions

Stop when the agent declares completion or when the configured benchmark resource envelope is exhausted.

Recommended first envelope:

- wall-clock cap: 60 minutes
- one workspace
- no production/external side effects
- no manual coding
- no scope expansion

## Capture

Record:

- start/end timestamps
- actual models
- model/provider usage if available
- estimated/billed model cost if available
- tool-call count
- build/test attempts
- failed checks
- number of files changed
- LOC added/deleted
- human interventions
- final git commit
- agent final report
- PDCA/risk state for B/C

## After run

Freeze the repo before evaluator execution.

Then apply the same evaluator and manual UX review to all variants.
