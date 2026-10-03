# Pi Ideas

This folder captures design ideas for the `ngtrthanh/pi` fork.

Status legend:

- **Implemented** — code exists in the fork.
- **Candidate** — concrete next-step design.
- **Exploration** — idea worth testing, not yet accepted.
- **[Inference]** — architectural/product judgment, not a measured benchmark.
- **[Unverified]** — external claim that still needs direct measurement.

## North star

> Build a minimal durable agent runtime that governs autonomous work under limited resources and continuously raises an evidence-backed baseline.

Pi should not become another giant workflow framework or personal-assistant monolith.

The current target stack is:

```text
                    CLIENT SURFACES
                         |
                   CONTROL PLANE
                         |
            risk / policy / resource allocation
                         |
                 PDCA SPIRAL GOVERNOR
                         |
               Pi Durable runtime
          conversation / task / state
                         |
           model / tool / execution env
                         |
                      evidence
                         |
                  baseline N+1
                         |
                         ↻
```

## Idea map

1. [Minimal ontology and architectural constitution](./01-architecture-constitution.md)
2. [Risk-driven PDCA spiral](./02-risk-pdca-spiral.md)
3. [Jev / System-One decision layer](./03-jev-system-one-layer.md)
4. [Gap-closure roadmap](./04-gap-closure-roadmap.md)
5. [Thin control plane](./05-thin-control-plane.md)
6. [Competitive landscape matrix](./06-competitive-landscape.md)
7. [Product positioning](./07-positioning.md)
8. [Next experiments](./08-next-experiments.md)

## Current implementation

Implemented on branch `feat/risk-pdca-spiral`:

- branch-sensitive PDCA state
- resource envelope
- risk register
- `do_now / this_cycle / next_cycle / backlog / accept`
- evidence register
- evidence-gated risk resolution
- evidence-gated baseline promotion
- residual-risk carryover
- optional Jev risk triage
- PDCA system-prompt policy
- `/pdca` command

The governor is intentionally implemented as an extension/policy layer, not as a new Pi core primitive.
