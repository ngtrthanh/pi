# Risk-driven PDCA spiral

A small supervisor/policy layer for Pi.

\`\`\`text
observe
  -> assess risks
  -> select only justified work for this cycle
  -> PLAN -> DO -> CHECK -> ACT
  -> standardize an evidence-backed baseline
  -> reassess residual risk
  -> next spiral
\`\`\`

The extension does **not** add a new Pi core primitive.

## Why

Autonomous agents tend to expand scope whenever they discover another issue. This extension separates:

\`\`\`text
finding a problem
        !=
authorizing work on it
\`\`\`

A risk can be classified as:

- \`do_now\`
- \`this_cycle\`
- \`next_cycle\`
- \`backlog\`
- \`accept\`

Only the first two belong in the active plan.

## Resource envelope

The cycle can declare:

- time minutes
- human-attention minutes
- budget
- max active tasks
- rough compute level
- notes/constraints

\`maxTasks\` is enforced for ordinary \`this_cycle\` selections. \`do_now\` can exceed it because an immediate intolerable risk should not be hidden by a planning quota.

## Risk heuristic

Each risk records 1-5 ratings for:

- impact
- likelihood
- urgency
- effort

The extension derives:

\`\`\`text
riskScore       = impact * likelihood
priorityDensity = riskScore * urgency / effort
\`\`\`

These are heuristics, not truth.

## Jev

If \`typesafe/jev-latest\` is available, \`risk_pdca(action="jev_triage")\` sends all open undecided risks in one classifier request.

Jev returns a structured \`Choice\` recommendation for each risk:

\`\`\`text
do_now | this_cycle | next_cycle | backlog | accept
\`\`\`

The recommendation retains probabilities/confidence.

By default Jev does **not** change the risk disposition. Set \`autoApply=true\` to apply only recommendations at or above \`minConfidence\` (default 0.8). Deterministic resource rules still win.

This uses Jev where it fits: fast structured decision support. It does not replace long-form planning, implementation, or evidence.

## Evidence gate

A treated risk cannot be resolved without recorded evidence.

A new baseline cannot be promoted without recorded evidence.

Evidence kinds:

- test
- command
- metric
- log
- diff
- document
- human
- other

## State and forks

State is stored as custom session entries, outside model context. On session start or tree navigation the extension scans the active branch and restores the latest snapshot.

This means a Pi fork gets the PDCA/risk state that existed at its fork point.

## Usage

\`\`\`bash
pi --extension packages/coding-agent/examples/extensions/risk-pdca/index.ts
\`\`\`

Inspect state:

\`\`\`text
/pdca
\`\`\`

The model gets one tool: \`risk_pdca\`.

## Architectural boundary

\`\`\`text
Model + Conversation + Tool + State + Task + Execution Environment
                              ^
                              |
                    risk-driven PDCA policy
\`\`\`
