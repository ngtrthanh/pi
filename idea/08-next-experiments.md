# Next experiments

Do not launch all of these at once.

Run them through the risk-driven PDCA governor.

## Experiment 1 — prove Cycle 1

Goal:

Verify the `risk-pdca` extension itself.

Evidence:

- typecheck
- extension load
- branch/fork reconstruction
- evidence gate rejects empty evidence
- baseline gate rejects empty evidence
- Jev unavailable path fails cleanly
- manual disposition still works
- next-cycle carryover works

Do not promote the baseline until this passes.

## Experiment 2 — Jev risk triage benchmark

Dataset:

Create a fixed set of realistic coding/ops findings.

Compare:

- frontier LLM only
- Jev triage + frontier escalation
- deterministic heuristic only

Measure:

- decision agreement
- latency
- cost
- number of frontier calls
- unsafe under-prioritization
- excessive do-now rate

Question:

> Does Jev reduce decision cost/latency without causing unacceptable triage mistakes?

## Experiment 3 — deferred tool discovery

Create a synthetic large tool catalog.

Compare:

```text
all schemas in context
vs
search/discover
vs
Jev shortlist + deferred load
```

Measure:

- prompt tokens
- correct tool selection
- latency
- model errors
- irrelevant schema exposure

## Experiment 4 — execution environment contract

Build a reference remote/sandbox provider outside core.

Need evidence for whether Pi actually lacks a reusable primitive.

Candidate lifecycle:

```text
allocate
health
execute
reconcile
release
```

Only move lifecycle concepts into core if several providers need the same smaller interface.

## Experiment 5 — multiplayer steering

Test:

- many watchers
- one writer
- two concurrent steering clients
- disconnect/reconnect
- ownership transfer
- human interrupt
- stale attachment

Goal:

Find the smallest coordination policy required above current attachment routing.

## Experiment 6 — thin control-plane reference

Prototype outside core:

```text
identity
policy
conversation attach
environment lease
quota
audit
```

Success criterion:

It composes Pi without modifying the minimal ontology.

## Experiment 7 — governed software task benchmark

Use real repos.

Run:

```text
Pi baseline
Pi + Durable
Pi + Durable + PDCA
Pi + Durable + PDCA + Jev
```

Measure:

- task completion
- regression rate
- unnecessary edits
- number of discovered-but-deferred risks
- frontier tokens
- wall-clock time
- retries
- evidence quality
- residual-risk accuracy

This experiment should determine whether the PDCA layer is real value or just elegant architecture.
