# Public acceptance contract

## Functional

- [ ] app starts with a missing/empty DB
- [ ] assets CRUD works
- [ ] work-order create/edit/filter/search works
- [ ] all five statuses work
- [ ] DONE without evidence is rejected
- [ ] DONE stores completion timestamp
- [ ] reopening DONE clears completion timestamp
- [ ] stale-version update is rejected or reconciled explicitly
- [ ] audit history is append-only and visible
- [ ] CSV import handles valid + invalid rows in one file
- [ ] repeated external IDs are idempotent
- [ ] CSV export reflects current filter
- [ ] dashboard counts are correct
- [ ] `/healthz` responds successfully
- [ ] `/api/work-orders` returns valid JSON

## Engineering

- [ ] deterministic migrations
- [ ] parameterized DB access
- [ ] no secrets committed
- [ ] no runtime CDN/internet requirement
- [ ] tests cover key transition rules
- [ ] tests cover stale-version behavior
- [ ] tests cover import idempotency
- [ ] `go test ./...` passes
- [ ] `go vet ./...` passes
- [ ] `go build ./...` passes

## Product

- [ ] useful README
- [ ] usable 1024px layout
- [ ] tablet-width layout remains usable
- [ ] clear validation/error feedback
- [ ] no major out-of-scope subsystem
