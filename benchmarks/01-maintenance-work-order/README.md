# Benchmark 01 — MaintBoard

Purpose:

> Test whether Pi Spiral / SRPJ produces a better software product per unit of time and model cost than vanilla Pi.

The benchmark is deliberately an ordinary industrial web-app task, not a PDCA/risk-management app, so the test does not directly reward the governor's own vocabulary.

## Variants

Run from identical clean workspaces:

### A — Vanilla Pi

Same base model as B.

No risk-PDCA extension.

No Jev router.

### B — Pi Spiral

Same base model as A.

Load:

```text
risk-pdca
```

No Jev virtual model.

### C — pi-srpj

Load:

```text
risk-pdca
jev-router
model = jev/auto
```

Optional external references later:

- Claude Code
- Codex

Do not mix those into the first A/B/C conclusion.

## Files

- `TASK.md` — prompt given to the agent
- `ACCEPTANCE.md` — public acceptance contract
- `RUN_PROTOCOL.md` — fairness rules
- `SCORING.md` — quality/efficiency evaluation
- `fixtures/work_orders.csv` — initial import data

## North-star question

Does governed, risk-aware, selectively routed autonomy improve the ratio:

```text
finished product quality
------------------------
time + model cost + rework
```

without increasing critical defects?
