# Architecture constitution

## Core idea

Do not start with an "Agent" object zoo.

Start with a minimal set of durable primitives:

```text
Model
Conversation
Task
Tool
State
Execution Environment
```

### Model

Replaceable intelligence.

A conversation must survive model switching.

A logical model can route to physical models.

### Conversation

Primary unit of continuity.

A conversation is the runtime case file.

Consequences:

- switching model does not create a new conversation
- resuming work reopens a conversation
- a subagent can be another conversation
- another device attaches to the same conversation
- conversation context is a projection, not the persistence format

### Task

Durable execution unit.

A task must survive process death and carry enough information to decide whether it should:

- resume
- retry
- reconcile
- stop
- wait
- escalate

### Tool

Capability.

Tools should be discoverable without forcing every tool schema into model context.

Capability space must remain larger than prompt space.

### State

What must survive process death.

Examples:

- task state
- risk register
- checkpoints
- resource envelope
- accepted residual risks
- evidence references
- baseline
- routing state

### Execution Environment

Where effects happen.

The same tool name can have radically different consequences depending on environment:

```text
bash@local
bash@sandbox
bash@staging
bash@production
bash@remote-vm
```

Environment identity therefore matters for security, auditability, side-effect semantics, and recovery.

## Not a primitive

The following should normally be composed from the primitives rather than added as new core ontology:

- subagent
- workflow step
- memory
- skill
- PDCA cycle
- reviewer
- planner
- coding agent
- research agent

### Example

```text
subagent       = conversation + policy + model/tool loadout
workflow step  = task
memory         = persisted state / transcript / materialized projection
skill          = reusable state/artifact/tool guidance
PDCA           = governance policy over tasks/state/evidence
```

## Important enterprise boundary

Conversation can be the orchestration truth.

It should **not** become authoritative domain truth.

Domain SST stays in domain systems:

```text
Postgres
event store
Git
telemetry DB
ERP/WMS/CMMS
object storage
```

Pi orchestrates those sources; it does not replace them.

## Design test

Before adding a new core abstraction, ask:

> Can this be expressed cleanly using the existing primitives?

If yes, keep it outside core.
