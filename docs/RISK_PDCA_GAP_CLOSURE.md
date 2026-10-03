# Pi gap-closure program

Objective:

> Close the practical gap between Pi's strong agent primitives and a production-grade agent runtime without turning the core into a monolithic orchestration framework.

## Starting architectural baseline

| Area | Starting estimate |
|---|---:|
| Model | 90% |
| Conversation | 95% |
| Tool | 95% |
| State | 95% with Durable |
| Task | 90% with Durable |
| Execution Environment | 85% |
| Multiplayer | 80% |
| Production platform | 50% |

These percentages are architectural estimates, not upstream metrics.

## Control method

Every improvement cycle uses the risk-driven PDCA spiral:

\`\`\`text
OBSERVE
  -> RISK ASSESS
  -> SELECT INSIDE RESOURCE ENVELOPE
  -> PLAN
  -> DO
  -> CHECK WITH EVIDENCE
  -> ACT / STANDARDIZE
  -> REASSESS RESIDUAL RISK
  -> NEXT SPIRAL
\`\`\`

Do not chase every finding in the current cycle.

## Jev role

Jev is a fast structured decision layer, not a general reasoning replacement.

Use it for:

1. **model routing** — already demonstrated by \`jev-router.ts\`;
2. **risk triage** — classify many independent risks in parallel;
3. **confidence gates** — auto-apply only high-confidence low-consequence decisions;
4. **judge/verify signals** — add one fast probabilistic signal beside hard evidence.

Do not use Jev as evidence that a build, deploy, migration, or test actually succeeded.

Hard evidence remains hard evidence.

## Priority gap order

### 1. Execution Environment: 85% -> target higher

Inspect and improve only where evidence shows a reusable primitive is missing:

- environment identity and reproducibility
- lifecycle: provision / health / destroy
- isolation and workspace/tenant boundary
- resource quota/capability policy
- crash/recovery semantics for side effects
- remote execution contract

Avoid embedding a container platform into the coding agent.

### 2. Multiplayer: 80% -> target higher

Durable already has watch/steer primitives. Remaining production questions include:

- authenticated client identity
- authorization per conversation/action
- ownership / lease / steering conflict policy
- presence and reconnect semantics
- audit trail for who steered what
- backpressure and rate policy

Keep one durable conversation as the source of truth.

### 3. Production platform: 50% -> target higher

Expected application-layer gaps:

- authentication / authorization
- tenant isolation
- quotas
- audit
- secrets policy
- deployment topology
- health/readiness
- observability
- HA/recovery
- billing/cost attribution

Do not move these into Pi core unless repeated implementations prove a smaller reusable primitive is missing.

## Cycle 1

Goal: establish the governor with minimal core impact.

Deliverables:

- branch-sensitive PDCA state
- resource envelope
- risk register and dispositions
- optional Jev risk triage
- evidence register
- evidence-gated risk resolution
- evidence-gated baseline promotion
- residual-risk carryover
- no Pi core changes

Exit evidence:

- extension typechecks with the examples project
- extension loads through the existing extension API
- state reconstructs from active branch entries
- resolving a risk without evidence is rejected
- promoting a baseline without evidence is rejected
- Jev absence fails cleanly and manual disposition remains available

## Cycle 2 entry condition

Only begin after Cycle 1 has build/test evidence. Then inspect Execution Environment first, create concrete risks, and select a bounded subset by risk reduction per complexity.


## Source-inspection findings after Cycle 1 implementation

### Execution Environment boundary

`ExecutionEnv` is deliberately a portable `FileSystem + Shell` capability with a stable filesystem identity. The host supplies the environment factory. Provisioning, container lifecycle, quotas, and tenant isolation are therefore composition-layer concerns unless repeated implementations reveal a smaller reusable contract.

Decision: **do not add container/platform lifecycle to the durable core in Cycle 1**.

### Multiplayer boundary

Durable already exposes committed conversation views and exact-frame watches. The server has per-client session attachments and fences calls to `serverId + sessionId + attachmentId`.

The byte transport is explicitly documented as an already-authorized connection. Authentication belongs before the Pi byte connection boundary.

Decision: **do not put login/auth tokens into the Pi wire protocol merely to raise a maturity score**.

### Production gap: control-plane composition

The remaining production gap is better represented as a layer above the existing primitives:

```text
clients
  |
identity / authorization / quotas / audit
  |
Pi server + protocol
  |
Durable conversations/tasks/state
  |
managed ExecutionEnv provider
```

Candidate Cycle 2 artifact: a small reference control-plane host that composes these boundaries without changing the Pi conversation/tool/task ontology.

### Current residual risk

GitHub Actions has not produced a workflow run for this fork/PR yet. Cycle 1 is therefore **not baseline-promoted**. Mergeability alone is not build/test evidence.
