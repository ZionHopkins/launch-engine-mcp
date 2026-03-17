export const RAPID_STATUS = `# /rapid-status — Rapid Test Portfolio Status

## What This Does

Shows the status of all rapid tests — active, ready to deploy, graduated, and killed — in a single dashboard view. Designed for managing a portfolio of 5-10 simultaneous idea tests.

## Trigger Context
User wants to see all rapid tests at a glance. Also useful before deciding which idea to test next.

## Execution Protocol

### Step 1: Load All Rapid Tests
Read \`rapid_tests\` from pipeline-state.json.

If \`rapid_tests\` key doesn't exist or is empty:
\`\`\`
No rapid tests yet. Run /rapid-test [your idea] to start your first one.
\`\`\`

### Step 2: Categorize Tests

Sort all rapid tests into categories by status:
- **ACTIVE**: status = "active"
- **READY TO DEPLOY**: status = "ready_to_deploy"
- **GRADUATED**: status = "graduated"
- **EXTENDED**: status = "extended"
- **KILLED**: status = "killed"

### Step 3: Present Dashboard

\`\`\`
RAPID TEST PORTFOLIO — [today's date]
═══════════════════════════════════════

ACTIVE TESTS:
  [market-slug] — Day [X] of [Y] | $[spent]/$[budget] | Last check: [verdict]
    CTR: [X]% | Conversions: [X] | Cost/conv: $[X]
  [market-slug] — Day [X] of [Y] | $[spent]/$[budget] | Last check: [verdict]
    CTR: [X]% | Conversions: [X] | Cost/conv: $[X]

READY TO DEPLOY (assets generated, not yet live):
  [market-slug] — Created [date] | Budget: $[X] over [Y] days
    Assets: assets/[slug]/rapid-test/

GRADUATED (moved to full pipeline):
  [market-slug] — Graduated [date] | Signal: [key winning metric]
    Full pipeline stage: [current_stage from pipelines entry, or "not started yet"]
    Total test spend: $[X]

KILLED:
  [market-slug] — Killed [date] | Spent: $[X] | Learning: [one sentence]
  [market-slug] — Killed [date] | Spent: $[X] | Learning: [one sentence]

───────────────────────────────────────
SUMMARY:
  Total ideas tested: [count of all non-ready tests]
  Total invested: $[sum of all spend across all tests]
  Graduated: [count] ([percentage]% win rate)
  Killed: [count]
  Active: [count]
  Ready to deploy: [count]
\`\`\`

### Step 4: Pattern Detection (3+ completed tests)

If 3 or more tests have reached a final verdict (graduated or killed):

\`\`\`
PATTERNS DETECTED:
  - [Pattern observation — e.g., "Pain-first ads consistently outperform promise-first ads across your tests"]
  - [Pattern observation — e.g., "Markets with existing Reddit communities graduate; markets without get killed"]
  - [Pattern observation — e.g., "Your $47 price point tests convert better than $97"]
\`\`\`

If fewer than 3 completed tests, skip this section.

### Step 5: Suggest Next Action

Based on portfolio state, suggest ONE action:

- If active tests need checking: "Next: Run \`/rapid-check\` to update [test name] (last checked [date])"
- If ready-to-deploy tests exist: "Next: Deploy [test name] — follow checklist in \`assets/[slug]/rapid-test/deployment-checklist.md\`"
- If a graduated test hasn't entered the full pipeline: "Next: Run \`/rapid-graduate [slug]\` to start the full pipeline for [test name]"
- If no active tests and no ready-to-deploy: "Next: Run \`/rapid-test [idea]\` to test your next idea"
- If overdue daily checks exist (active test, last check > 1 day ago): "OVERDUE: [test name] hasn't been checked since [date]. Run \`/rapid-check [slug]\`"

## Autonomy
Tier 1 — Full Auto. Read-only, no state changes.

## Output
Inline dashboard. No file saved. No state changes.

## Next Step
Route to \`/rapid-test\`, \`/rapid-check\`, \`/rapid-graduate\`, or full pipeline commands based on portfolio state.`;
