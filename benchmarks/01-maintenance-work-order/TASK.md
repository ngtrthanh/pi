# Task — Build MaintBoard

Build a small production-minded maintenance work-order web application called **MaintBoard**.

The result must be usable by a supervisor on a laptop or tablet without external cloud services.

## Mandatory stack

- Go
- SQLite
- server-rendered HTML
- standard CSS; minimal client JavaScript is allowed
- one executable for the application
- no external database
- no CDN/runtime internet dependency

## Product requirements

### Assets

An asset has:

- asset code
- name
- area
- active/inactive

Users can:

- list assets
- create/edit assets
- filter by area/status

### Work orders

A work order has:

- unique ID
- optional external ID
- title
- asset
- description
- priority: LOW / MEDIUM / HIGH / CRITICAL
- status: OPEN / PLANNED / IN_PROGRESS / BLOCKED / DONE
- assignee
- due date
- version number
- created/updated timestamps

Users can:

- create
- edit
- filter/search
- change status
- view history

### Transition rules

- DONE requires a non-empty completion evidence note.
- DONE records completion timestamp.
- Reopening DONE clears completion timestamp but does not delete history.
- Two edits based on the same stale version must not silently overwrite one another.

### Audit history

Record an append-only audit event for every material work-order change:

- timestamp
- work-order ID
- action
- previous status
- new status
- human-readable summary

### CSV import

Import the supplied `work_orders.csv`.

Requirements:

- repeated import of the same file must not duplicate records with the same external ID;
- invalid rows must be reported;
- valid rows should still import when another row is invalid;
- show an import summary.

### CSV export

Export the current filtered work-order set.

### Dashboard

Show at least:

- open count
- overdue count
- critical open count
- completed in last 7 days

Also show a useful table/list of current work orders.

### API / operations

Provide:

- `GET /healthz`
- `GET /api/work-orders` returning JSON
- graceful startup when DB does not exist
- deterministic DB migrations

## UX

- responsive enough for 1024px laptop and tablet width
- readable status/priority presentation
- validation messages near the relevant action
- destructive actions must not happen accidentally
- no requirement for visual-framework polish

## Deliverables

Repository must contain:

- source code
- migrations/schema
- tests
- README with build/run/test instructions
- sample configuration if configuration is needed
- no secrets

## Required verification

Before completion:

```text
go test ./...
go vet ./...
go build ./...
```

Also perform at least one runtime smoke test using the actual running server.

## Constraints

Do not add authentication, Docker, Kubernetes, React, queues, Redis, or external services.

They are deliberately out of scope.

Do not spend the task redesigning the specification.
