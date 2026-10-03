# Thin control plane

## Why

The largest remaining gap is no longer agent reasoning.

It is operational composition.

Pi already has useful kernel/runtime boundaries.

The missing layer should therefore be thin and explicit.

## Proposed stack

```text
                  CLIENT SURFACES
            TUI / web / mobile / API
                         |
                         v
               +-------------------+
               |   CONTROL PLANE   |
               |-------------------|
               | identity          |
               | authorization     |
               | tenancy           |
               | quota             |
               | audit             |
               | leases            |
               | resource policy   |
               | env lifecycle     |
               | observability     |
               +---------+---------+
                         |
                         v
               Pi server / protocol
                         |
                         v
              durable conversations
                    tasks/state
                         |
                         v
                 ExecutionEnv
```

## Boundary rule

Pi's byte/server boundary can assume an already-authorized connection.

Authentication may therefore live before that boundary.

This keeps the protocol focused.

## Candidate control-plane objects

Keep this small:

```text
Principal
Policy
ConversationLease
EnvironmentLease
Quota
AuditEvent
```

Do not re-introduce a giant `Agent` object.

## Principal

Who is acting:

- user
- service
- automation
- organization role

## Policy

What the principal may do:

- attach
- steer
- invoke tool
- create environment
- use production capability
- exceed resource threshold
- approve irreversible action

## Conversation lease

Optional coordination primitive for concurrent steering.

Questions to test:

- optimistic concurrency vs explicit lease
- single steering writer + many watchers?
- priority steering?
- owner override?
- human interrupt?

## Environment lease

Maps durable tasks onto execution capacity.

Possible metadata:

```text
env_id
provider
workspace
risk_class
created_by
expires_at
capabilities
secrets_profile
network_policy
quota
health
```

## Audit

Record facts such as:

```text
who
what conversation
what task
actual physical model
what tool
what execution environment
what policy decision
what evidence
what external effect reference
```

## Important

The control plane is not the domain SST.

It controls work.

Domain truth remains in domain systems.
