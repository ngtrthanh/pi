# Risk-driven PDCA spiral

## Why a spiral, not a circle

Resources are finite.

A useful autonomous system cannot attempt to fix every discovered issue in the same loop.

The control model is therefore:

```text
OBSERVE
   ↓
ASSESS RISK
   ↓
PRIORITIZE
   ↓
SELECT WORK INSIDE RESOURCE ENVELOPE
   ↓
PLAN
   ↓
DO
   ↓
CHECK
   ↓
ACT
   ↓
STANDARDIZE
   ↓
REASSESS RESIDUAL RISK
   ↓
NEXT SPIRAL
```

Each cycle should leave the system at a higher evidence-backed baseline.

## Key rule

```text
finding a problem
        !=
authorizing work on it
```

A newly discovered issue is first recorded and assessed.

It does not automatically interrupt current work.

## Risk disposition

Each risk may be classified as:

```text
DO NOW
THIS CYCLE
NEXT CYCLE
BACKLOG
ACCEPT
```

Only the first two enter the active plan.

## Resource envelope

Each spiral can declare a bounded envelope:

```text
time
human attention
budget
compute
max active tasks
dependencies
risk tolerance
```

The optimizer-like objective is:

```text
maximize:
    justified risk reduction
    + value gain

subject to:
    limited resources
    dependencies
    reversibility
    acceptable residual risk
```

This is intentionally not "finish every TODO".

## Risk heuristic

A lightweight heuristic:

```text
risk score       = impact × likelihood
priority density = risk score × urgency / effort
```

These are decision aids, not truth.

Other material factors:

- dependency
- reversibility
- detectability
- user intent
- side-effect class
- cost of delay
- confidence
- safety/security implications

## Evidence-first CHECK

CHECK must not mean:

> the model thinks it looks fine.

Objective evidence includes:

- build exit code
- unit tests
- integration tests
- lint/static analysis
- benchmarks
- logs
- HTTP health checks
- DB state
- telemetry
- diffs
- documents
- explicit human acceptance

## FAIL does not mean FIX NOW

A failed check can result in:

```text
record finding
    ↓
risk assess
    ↓
do_now?
  yes → interrupt
  no  → defer / accept / backlog
```

This prevents scope explosion and "agent ADHD".

## Standardization

A successful ACT should create a durable new known-good state:

- new test
- config
- baseline
- runbook
- policy
- code
- deployment state
- acceptance criterion

The next loop starts from that standardized state, not from model memory.

## Two loops

Do not replace Pi's inner agent loop with PDCA.

Use nested clocks:

```text
OUTER:
PLAN → DO → CHECK → ACT → STANDARDIZE → next spiral

INNER:
state → model → tool → state → model → tool ...
```

The inner loop is fast execution.

The outer loop is slower governance and improvement.
