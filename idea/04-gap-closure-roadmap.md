# Gap-closure roadmap

## Starting architectural estimate

These scores are **[Inference]**, not upstream measurements.

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

## Goal

Do not maximize the maturity score by stuffing platform features into Pi core.

Use the PDCA spiral to close real gaps only after evidence shows a reusable primitive is missing.

## Priority order

### 1. Execution Environment

Current core is intentionally close to:

```text
ExecutionEnv = FileSystem + Shell
```

Potential higher-layer gaps:

- environment identity
- reproducibility
- provisioning
- health/readiness
- lifecycle
- quota
- workspace isolation
- tenant isolation
- remote environment contract
- credential boundary
- policy
- reconciliation of external effects

Do not embed Kubernetes/container orchestration into the coding-agent core.

### 2. Multiplayer

Existing strengths:

- durable conversation views
- exact-frame watch
- per-client attachment
- session routing
- attachment fencing

Remaining platform concerns:

- authenticated identity
- authorization
- ownership / leases
- simultaneous steering policy
- presence
- reconnect semantics
- actor audit
- rate/backpressure policy

### 3. Production platform

Expected high-level concerns:

- authentication
- authorization
- tenant isolation
- quotas
- audit
- secrets
- observability
- health/readiness
- deployment topology
- HA/recovery
- cost attribution
- policy management

Most belong above Pi runtime.

## Critical architectural lesson

Do not "fill the gap" by adding:

```text
JWT
RBAC
Kubernetes
billing
channels
tenant management
container pools
```

directly into the Pi kernel just to improve a maturity score.

Prefer composition:

```text
control plane
     ↓
Pi server/protocol
     ↓
Pi Durable
     ↓
ExecutionEnv provider
```

## Gap closure itself should use PDCA

```text
observe actual missing capability
      ↓
assess risk/value
      ↓
select bounded change
      ↓
implement
      ↓
objective tests
      ↓
standardize
      ↓
re-score
```

No score increase without evidence.
