export const VALIDATE_CHECK = `# /validate-check — Daily 60-Second Health Check

## What This Does

Rapid daily diagnostic during active validation. User pastes raw numbers, gets an instant traffic-light verdict and one specific action. Not a full analytics review — just the minimum viable feedback loop.

## Trigger Context
During any active validation window. User runs this daily (or every other day minimum).

## Execution Protocol

### Step 1: Accept Data Input

Accept data in ANY format. The user might:
- Paste the daily template from \`/validate-prep\`
- Type numbers conversationally ("spent $47 today, got 89 clicks, 3 signups")
- Describe a screenshot ("Meta shows CTR 1.2%, CPC $0.53, 2 conversions")
- Paste a CSV or table from a dashboard

Parse whatever comes in. Don't ask for reformatting. Extract what's available, flag what's missing only if it's critical to the diagnosis.

### Step 2: Load Context

Read from pipeline-state.json:
- Current validation tier
- Decision thresholds (from /validate-prep)
- Previous daily check data (if any)
- Unit economics guardrails
- Days remaining in validation window

### Step 3: Instant Diagnosis

Compare today's data against thresholds. Output ONE of three verdicts:

**🟢 ON TRACK**
\`\`\`
Day [X] of [Y] | Spend: $[cumulative] of $[budget]
Key metric: [the one that matters most at this tier] = [value] (target: [threshold])
Status: On track. No changes needed.
Action: Keep running. Check again tomorrow.
\`\`\`

**🟡 WATCH**
\`\`\`
Day [X] of [Y] | Spend: $[cumulative] of $[budget]
Concern: [specific metric] at [value] (target: [threshold])
Context: [one sentence — is this normal early noise or a real signal?]
Action: [one specific thing to check or adjust — NOT a full overhaul]
Check again: [tomorrow / in 48 hours]
\`\`\`

**🔴 KILL SIGNAL**
\`\`\`
Day [X] of [Y] | Spend: $[cumulative] of $[budget]
Problem: [specific metric] at [value] — hit kill threshold of [threshold]
Diagnosis: [one sentence root cause — creative, targeting, page, or offer]
Action: PAUSE [specific campaign/ad]. [One specific next step.]
Run /validate-decide now? Or give it [X] more hours?
\`\`\`

### Step 4: Trend Detection

If this is day 3+, compare against previous daily checks:
- Improving trend → Note it. "CPA dropping steadily: $12 → $9 → $7. Trending toward target."
- Degrading trend → Flag it. "CTR declining 3 days straight. Creative fatigue starting early."
- Volatile / no pattern → Normal for small budgets. Note it but don't overreact.

### Step 5: Update State

Append today's data to pipeline-state.json validation log:
\`\`\`json
{
  "date": "[today]",
  "day_number": [X],
  "data": { [whatever was provided] },
  "verdict": "[green/yellow/red]",
  "action_taken": "[what was recommended]",
  "cumulative_spend": [running total],
  "cumulative_conversions": [running total]
}
\`\`\`

### Step 6: Countdown

\`\`\`
Validation window: [X] days remaining.
Next check: [tomorrow's date]
Decision date: [date from /validate-prep]
\`\`\`

## Rules
- NEVER recommend a full campaign overhaul from a single day's data at small budgets.
- At $50/day, daily fluctuations are noise. Trends over 3+ days are signal.
- Don't overwhelm with metrics. One verdict, one number, one action.
- If data is insufficient to diagnose (e.g., only 12 impressions), say so: "Not enough data yet. This is normal on day 1. Check again tomorrow."
- Always end with the countdown to decision date.

## Autonomy
Tier 1 — Full Auto. No decisions required. Pure information delivery.

## Output
Traffic light verdict + one action. Presented inline, no file saved (state updated in pipeline-state.json).

## Next Step
Tomorrow → \`/validate-check\` again
Decision date reached → \`/validate-decide\`
Kill signal confirmed → \`/validate-decide\` immediately`;
