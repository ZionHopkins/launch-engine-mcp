export const STATUS = `# /status — Pipeline Status Report

## What This Does

Reads pipeline-state.json and presents a clear status report.

## Execution Protocol

1. Read \`pipeline-state.json\` from project root.
2. Read \`learnings.json\` — note total learnings count.
3. Identify active pipeline (if any).
4. Present:

\`\`\`
PIPELINE: [market name]
STAGE: [current stage]
AUTONOMY: [score] — [classification]

COMPLETED:
✅ Scout — [date]
✅ Autonomy Score — [score/35]
✅ Market Intelligence — [score/120]
✅ Therapeutic Buyer — [personas count]
✅ Building Blocks — [date]
✅ Stress Test — [verdict] [score/50]
✅ Unit Economics — [verdict] (Target CPA: $[X] | Budget: $[X]/day)
...

CURRENT:
🔄 [Current SOP] — [status/progress]

NEXT:
⬜ [Next SOP]

FINANCIAL GUARDRAILS (if unit economics complete):
💰 Target CPA: $[X] | Break-even: $[X] | Daily budget: $[X]
   Max Tier 1 burn: $[X] | Max Tier 2 burn: $[X]

VALIDATION STATUS (if in validation):
📊 Tier [N] — Day [X] of [Y]
   Spend: $[cumulative] | Conversions: [X] | CPA: $[X]
   Last check: [date] — [verdict emoji]
   Decision date: [date]

DECISIONS PENDING:
⚠️ [Any Tier 3/4 decisions waiting for user input]

ASSETS GENERATED:
📄 [list of files in assets folder]

PATTERN LIBRARY:
🧠 [X] learnings captured across [X] pipelines
   [X] high confidence | [X] medium | [X] low
\`\`\`

5. If no active pipeline: "No active pipeline. Say /scout to start a new one, or describe your market idea."

6. If multiple pipelines exist, list them and ask which to resume.

7. If in active validation: remind user to run \`/validate-check\` if they haven't today.

8. If daily-check hasn't been run and campaigns are live: gentle nudge to run \`/daily-check\`.

## No State Updates
This command is read-only. It never modifies pipeline-state.json.`;
