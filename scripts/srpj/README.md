# Pi Spiral / pi-srpj test launchers

## Naming

Human-facing experimental name:

> **Pi Spiral**

Technical/profile name:

> **pi-srpj** = Spiral + Risk + PDCA + Jev

Avoid renaming the upstream `pi` executable in core for now.

The test package includes two launchers:

### `pi-spiral`

Loads only the risk-driven PDCA supervisor.

Use this to isolate whether governance itself improves output.

### `pi-srpj`

Loads:

- risk-PDCA supervisor
- existing Jev virtual-model router
- `--model jev/auto`

Use this to test the complete SRPJ hypothesis.

## Credentials

`pi-spiral` uses whatever normal model/auth configuration Pi already has.

`pi-srpj` expects the requirements of the existing `jev-router.ts`, including TypeSafe classifier credentials for Jev when available and an OpenAI Codex login for the routed models.

If Jev is unavailable, the existing router can fall back in its planning choice, but the routed Codex models still require their normal authentication.

## Why profiles, not a forked core binary

For the experiment we want:

```text
same Pi core
same task
same environment
different policy/routing layers
```

That gives a cleaner benchmark than changing the core and the policy at the same time.
