# Competitive landscape

## Purpose

Understand where Pi should differentiate rather than copy competitors.

Scores below are **[Inference] comparative product/architecture judgments**, not benchmark results.

## Matrix

| System | Core architecture | Coding execution | Durable autonomy | Knowledge work | Control plane / multiplayer | Surfaces / integrations | Governance / evidence | Learning / memory | Production maturity |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Pi + Durable + PDCA/Jev | 9.5 | 8.5 | 9.0 | 5.5 | 6.5 | 5.0 | 8.5 | 7.0 | 5.5 |
| OpenClaw | 7.5 | 7.0 | 8.5 | 8.0 | 10.0 | 10.0 | 8.0 | 8.0 | 9.0 |
| Hermes | 7.5 | 8.0 | 9.5 | 8.0 | 8.5 | 9.5 | 8.5 | 10.0 | 8.5 |
| Claude Code | 8.0 | 10.0 | 9.0 | 5.5 | 8.5 | 8.5 | 8.5 | 7.5 | 9.5 |
| Claude Cowork | 7.0 | 7.0 | 8.5 | 10.0 | 7.5 | 9.0 | 9.0 | 8.5 | 8.5 |
| Codex | 8.5 | 10.0 | 9.5 | 7.5 | 9.5 | 9.5 | 9.0 | 8.5 | 9.5 |
| ChatGPT Work | 7.0 | 7.0 | 9.0 | 10.0 | 9.0 | 9.5 | 9.5 | 8.5 | 9.5 |

## Radar data

Use these rows to reproduce the radar chart:

```csv
system,core,coding,durable,knowledge,control_plane,surfaces,governance,learning,production
Pi + Durable + PDCA/Jev,9.5,8.5,9.0,5.5,6.5,5.0,8.5,7.0,5.5
OpenClaw,7.5,7.0,8.5,8.0,10.0,10.0,8.0,8.0,9.0
Hermes,7.5,8.0,9.5,8.0,8.5,9.5,8.5,10.0,8.5
Claude Code,8.0,10.0,9.0,5.5,8.5,8.5,8.5,7.5,9.5
Claude Cowork,7.0,7.0,8.5,10.0,7.5,9.0,9.0,8.5,8.5
Codex,8.5,10.0,9.5,7.5,9.5,9.5,9.0,8.5,9.5
ChatGPT Work,7.0,7.0,9.0,10.0,9.0,9.5,9.5,8.5,9.5
```

## Product families

### Engineering super-agents

```text
Claude Code
Codex
```

Strong at deep coding, repo work, parallel agents, cloud execution, verification, and mature product surfaces.

### General work agents

```text
Claude Cowork
ChatGPT Work
```

Strong at documents, research, connected apps, browsing, files, long multi-step knowledge work.

### Open/personal agent platforms

```text
OpenClaw
Hermes
```

Strong at channels, personal automation, long-running presence, memory, skills, distribution, gateways.

### Pi new

Target:

```text
minimal durable governed runtime
```

Pi should not try to beat all systems on every axis.

Its opportunity is a cleaner kernel plus governance.

## Strength/weakness shape

Current Pi fork:

```text
strong:
  core architecture
  conversation/task/state
  tool/context discipline
  durability
  governance direction

weak:
  surfaces
  integrations
  production control plane
  auth/tenancy/quota/audit composition
```

The weak side should be closed with a thin control plane, not by bloating core.
