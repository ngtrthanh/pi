# Jev / System-One decision layer

## Role

Jev should not replace frontier-model reasoning.

It is better treated as a fast typed decision layer for high-volume atomic judgments.

Mental model:

```text
Jev = smart typed branching
LLM = deep reasoning
hard evidence = truth about external execution
```

## Good uses

### 1. Model routing

Existing Pi example:

```text
request
  ↓
Jev complexity classifier
  ↓
easy/standard → cheaper model
complex       → stronger model
  ↓
implementation phase may route again
```

Logical model and physical model remain separate.

### 2. Risk triage

Candidate/implemented:

```text
many undecided risks
        ↓
       Jev
        ↓
do_now / this_cycle / next_cycle / backlog / accept
        ↓
probabilities + confidence
```

The deterministic governor remains authoritative.

### 3. Confidence gates

Example:

```text
Jev recommendation
       ↓
confidence >= threshold?
       ↓
yes → may auto-apply low-consequence decision
no  → leave undecided
```

Never use probabilistic confidence as a substitute for hard evidence.

### 4. Deferred tool discovery

Candidate:

```text
thousands of tools
      ↓
     Jev
      ↓
select namespaces / shortlist
      ↓
Codemode / frontier model
      ↓
actual tool invocation
```

This reinforces:

```text
capability space != context space
```

### 5. Fast judge signal

CHECK can combine:

```text
hard evidence: tests
hard evidence: exit codes
hard evidence: telemetry
probabilistic signal: Jev
reasoning signal: frontier model review
```

Jev can help identify suspicious results.

It must not claim that an external effect happened.

## Where Jev should NOT decide alone

Do not delegate deterministic boundaries such as:

- authentication
- authorization
- tenant isolation
- destructive production permissions
- billing enforcement
- side-effect reconciliation
- proof that deploy/migration/payment actually succeeded

## Important caution

A typed classifier can return a valid value that is still the wrong judgment.

```text
valid schema != correct decision
```

Therefore use probability/confidence plus deterministic policy and evidence.
