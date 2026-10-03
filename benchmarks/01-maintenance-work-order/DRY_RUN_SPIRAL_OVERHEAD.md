# Dry run — Vanilla Pi vs current Spiral-PDCA extension

Date: 2026-10-03

This is a **mechanical overhead test**, not a quality benchmark.

The execution environment used the built Linux x64 artifact and a local mock OpenAI-compatible provider only to capture Pi's first provider request. No external LLM credential was available, so MaintBoard product quality was **not** evaluated.

## Configurations

### A — Vanilla Pi

```text
pi
built-in tools: read, bash, edit, write
```

### B — Current experimental Spiral-PDCA

```text
pi
+ examples/extensions/risk-pdca/index.ts
```

The tested extension is the current experimental implementation and still contains the redundant Jev-specific triage path. Jev itself already exists in Pi and should not be counted as a new capability of Spiral.

## Startup measurement

20 cold process starts for each configuration, RPC `get_state`, offline.

| Metric | Vanilla | Spiral-PDCA | Delta |
|---|---:|---:|---:|
| Mean startup | 371.15 ms | 437.23 ms | +66.08 ms (+17.8%) |
| Median startup | 369.32 ms | 427.22 ms | +57.90 ms (+15.7%) |
| p95 startup | 390.62 ms | 465.19 ms | +74.57 ms (+19.1%) |
| Mean max RSS | 135,960 KB | 141,047 KB | +5,087 KB (+3.7%) |

These numbers are environment-specific and should not be treated as universal Pi performance figures.

## First provider request

Same user message, same Pi binary, same mock model.

| Metric | Vanilla | Spiral-PDCA | Delta |
|---|---:|---:|---:|
| Request payload | 5,751 bytes | 9,729 bytes | +3,978 bytes (+69.2%) |
| System prompt | 2,646 chars | 4,894 chars | +2,248 chars (+85.0%) |
| Tool count | 4 | 5 | +1 |
| Added `risk_pdca` tool schema | — | 1,693 bytes | +1,693 bytes |

This is only serialized request size, not provider tokenization. It nevertheless proves that the current extension adds non-trivial context before any useful work has begun.

## Immediate runtime behavior

Vanilla commands:

```text
/llama
/mcp
```

Spiral-PDCA commands:

```text
/pdca
/llama
/mcp
```

Calling `/pdca` before any work produces:

```text
PDCA spiral: enabled
cycle=1 phase=observe
objective=(unset)
resources={}
selected=0
undecided=0
deferred=0
accepted=0
evidence=0
baseline=(none)
```

So the governor introduces state and workflow vocabulary before the agent has discovered a need for it.

## Implementation surface

Current experimental extension:

```text
579 LOC
20,517 bytes
13 actions
```

Actions include:

```text
status
enable
disable
set_objective
set_resources
record_risk
decide_risk
jev_triage
record_evidence
resolve_risk
set_phase
promote_baseline
next_cycle
```

## Interpretation

**[Inference]** The current implementation pays a measurable fixed harness tax before task execution.

That does not prove it lowers product quality. It does mean Spiral must earn back this cost through measurable improvements such as fewer false completion claims, less rework, better recovery, or higher acceptance-test pass rates.

A full MaintBoard A/B comparison remains blocked in this execution environment because no external model credential is configured.

## Decision discipline

Do not optimize the extension yet just to defend the idea.

Next useful evidence is:

```text
same model
same task
same clean workspace

A = vanilla Pi
B = Pi + Spiral-PDCA
```

If B does not produce a material quality/recovery advantage, remove the extension rather than making the governor more elaborate.
