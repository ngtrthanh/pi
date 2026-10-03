# Risk register

A finding is not automatically a task.

## Register

| ID | Risk / finding | Impact 1-5 | Likelihood 1-5 | Urgency 1-5 | Effort 1-5 | Score | Density | Disposition | Evidence / rationale |
|---|---|---:|---:|---:|---:|---:|---:|---|---|
| R1 |  |  |  |  |  |  |  |  |  |

## Heuristic

```text
score   = impact * likelihood
density = score * urgency / effort
```

Use the numbers as aids only.

Also consider:

- blocking dependency
- reversibility
- detectability
- external side effects
- cost of delay
- user intent
- security/safety
- resource envelope

## Dispositions

### DO NOW

Delay is not acceptable.

### THIS CYCLE

Material and justified inside current resources.

### NEXT CYCLE

Important, but residual risk is acceptable temporarily.

### BACKLOG

Keep visible; not scheduled.

### ACCEPT

Treatment cost/complexity is not currently justified. Record rationale.
