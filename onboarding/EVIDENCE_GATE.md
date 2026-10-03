# Evidence gate

## Rule

Model confidence is not completion evidence.

## Required checks

### Build

Command:

```text
<command>
```

Result:

```text
<exit code / artifact>
```

### Automated tests

Command:

```text
<command>
```

Result:

```text
<pass/fail counts>
```

### Runtime / smoke

Scenario:

```text
<what a real user does>
```

Observed result:

```text
<actual output>
```

### Diff review

- unexpected files:
- secrets:
- generated junk:
- scope creep:
- destructive changes:

### Acceptance matrix

| Criterion | Evidence reference | PASS/FAIL |
|---|---|---|
|  |  |  |

## Baseline promotion

Promote only when:

- required acceptance criteria pass;
- residual risks are recorded;
- known-good state is reproducible;
- rollback/recovery is understood where needed.
