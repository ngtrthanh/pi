# Onboarding templates

**Status:** reconstructed v1.

The original shared-chat URL supplied on 2026-10-03 could not be fetched from the current execution environment. This folder reconstructs the working templates from the design principles already adopted in this fork. Replace or amend with exact historical wording later if needed.

Goal:

> Give Pi a small, repeatable way to understand work, constrain scope, act, verify, and hand off without bloating the core prompt.

## Recommended use

For a new repository:

1. copy `WORKING_CONTRACT.md` to the project root or project instructions;
2. start each non-trivial task from `TASK_BRIEF.md`;
3. use `PDCA_CYCLE.md` when the task is multi-step or risky;
4. use `RISK_REGISTER.md` for discovered work that should not automatically enter scope;
5. use `EVIDENCE_GATE.md` before declaring completion;
6. use `HANDOFF.md` when another agent/session will continue.

## Principle

Keep the prompt small.

Store durable truth in files/state/tests, not in repeated prose.

```text
small instructions
      +
durable state
      +
objective evidence
      =
repeatable agent work
```
