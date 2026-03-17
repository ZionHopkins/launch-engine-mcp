export const RAPID_CHECK = `# /rapid-check — Rapid Test Daily Check

## What This Does

Daily check during an active rapid test. Paste your numbers in any format, get a verdict. At the end of the test window, produces a final GRADUATE / CONTINUE / KILL decision.

## Trigger Context
During an active rapid test window. User runs this daily (or every other day) after deploying ads. Accepts an optional market slug: \`/rapid-check [market-slug]\`.

## Execution Protocol

### Step 1: Identify Which Test

Check pipeline-state.json \`rapid_tests\` section.

- If the user specified a slug (e.g., \`/rapid-check meal-prep-truck-drivers\`), use that test.
- If only one test has \`status: "active"\` or \`status: "ready_to_deploy"\`, use it automatically.
- If multiple active tests exist, present a numbered list and ask which one:
  \`\`\`
  Multiple rapid tests active:
    1. meal-prep-truck-drivers — Day 2 of 5 | $30/$75 spent
    2. anxiety-new-moms — Day 1 of 5 | $15/$75 spent
  Which test? (number or name)
  \`\`\`

### Step 2: First Check — Mark as Active

If this is the first \`/rapid-check\` for this test:
- Update \`rapid_tests.[slug].status\` to \`"active"\`
- Update \`rapid_tests.[slug].deployment.campaign_live\` to \`true\`
- Update \`rapid_tests.[slug].deployment.start_date\` to today
- Calculate and set \`rapid_tests.[slug].deployment.end_date\` based on duration_days
- Ask: "What's your landing page URL?" and save to \`rapid_tests.[slug].deployment.landing_page_url\`

### Step 3: Accept Data Input

Accept data in ANY format:
- "Spent $14, got 203 impressions, 12 clicks, 1 signup"
- Pasted from Meta Ads Manager (table format, screenshot description, CSV)
- "12 clicks, 1 signup, about $15 spent"
- "nothing happened yet" (record as zeros)
- "same as yesterday basically" (duplicate previous day's rough numbers, note uncertainty)

Parse and extract: **spend**, **impressions**, **clicks**, **conversions/signups**. If the user omits a metric, calculate from what's available (e.g., CTR from clicks/impressions) or ask only if critical.

### Step 4: Load Context

From pipeline-state.json for this rapid test, load:
- Test parameters (budget, duration, offer type, price point)
- Decision thresholds (graduate/continue/kill criteria)
- All previous daily checks
- Days remaining in window
- Aggregate metrics so far

### Step 5: Update Aggregate Metrics

Add today's numbers to cumulative totals:
- \`total_spend += today_spend\`
- \`total_impressions += today_impressions\`
- \`total_clicks += today_clicks\`
- \`total_conversions += today_conversions\`
- Recalculate: \`ctr\`, \`cpc\`, \`cpa\`, \`conversion_rate\`

### Step 6: Produce Verdict

**Day 1-2 (Insufficient Data):**
\`\`\`
RAPID TEST: [Idea Name] — Day [X] of [Y]
Spend: $[today] ($[cumulative] of $[budget])
Data: [impressions] impressions | [clicks] clicks | [conversions] conversions
CTR: [X]% | CPC: $[X]

Status: COLLECTING DATA — Normal for Day 1-2. Need 500+ impressions for meaningful signal.
Action: Keep running. Check back tomorrow.
Days remaining: [Y-X]
\`\`\`

**Day 2+ with data — produce ONE of three verdicts:**

**SIGNAL DETECTED:**
\`\`\`
RAPID TEST: [Idea Name] — Day [X] of [Y]
Spend: $[cumulative] of $[budget] | [days remaining] days left
Impressions: [X] | Clicks: [X] | Conversions: [X]
CTR: [X]% | CPC: $[X] | Cost/conversion: $[X]

SIGNAL DETECTED
  [The specific metric exceeding threshold]: [value] vs [threshold needed]
  [If multiple metrics are strong, list the top 2]
Action: Keep running through Day [Y] to confirm signal strength.
[If already at graduation threshold: "Looking strong for graduation. Finish the window for confidence."]
\`\`\`

**WATCHING:**
\`\`\`
RAPID TEST: [Idea Name] — Day [X] of [Y]
Spend: $[cumulative] of $[budget] | [days remaining] days left
Impressions: [X] | Clicks: [X] | Conversions: [X]
CTR: [X]% | CPC: $[X] | Cost/conversion: $[X]

WATCHING — Mixed signal.
  Working: [what's performing]
  Not working: [what's underperforming]
Action: [One specific thing — "hold steady" or "if you can, swap the headline on your landing page to test" — never recommend overhauling the entire test mid-run]
\`\`\`

**NO SIGNAL:**
\`\`\`
RAPID TEST: [Idea Name] — Day [X] of [Y]
Spend: $[cumulative] of $[budget] | [days remaining] days left
Impressions: [X] | Clicks: [X] | Conversions: [X]
CTR: [X]% | CPC: $[X] | Cost/conversion: $[X]

NO SIGNAL — [specific evidence]
  [Key metric]: [value] vs [minimum needed]: [threshold]
Action: [If early and budget remains: "Give it one more day — some campaigns take 48h to optimize."
         If Day 3+ with zero signal: "Consider early kill. You've spent $[X] with [evidence of no demand]. Kill now to save $[remaining budget] for your next test. Run /rapid-check with 'kill' to end this test."]
\`\`\`

### Step 7: End-of-Window Decision (Final Day or Budget Exhausted)

On the last day of the test window, OR when budget is exhausted, OR when the user says "final numbers" or "that's it", produce a FINAL VERDICT:

**GRADUATE:**
\`\`\`
FINAL VERDICT: GRADUATE TO FULL PIPELINE

[Idea Name] showed real market signal:
  - [Key metric 1]: [value] (threshold was [X])
  - [Key metric 2]: [value]
  - Best performing ad: Ad [N] ([angle name]) — [CTR]% CTR
  - [Any qualitative signal: replies, comments, shares]

Total invested: $[total_spend] over [days] days

WHAT HAPPENS NEXT:
  Run /rapid-graduate [market-slug] to:
  1. Credit your rapid test research toward the full pipeline
  2. Carry forward: buyer snapshot, winning ad angle, conversion data
  3. Begin expanded research → full pipeline build

  This idea earned deeper investment. The rapid test was your scout.
\`\`\`

**CONTINUE (ambiguous signal):**
\`\`\`
FINAL VERDICT: CONTINUE — Signal is ambiguous

[Idea Name] showed mixed results:
  - What worked: [specific metrics/elements]
  - What didn't: [specific metrics/elements]
  - Best ad: Ad [N] ([angle]) — worst ad: Ad [N] ([angle])

Total invested: $[total_spend] over [days] days

OPTIONS:
  A. Extend 3 more days ($[daily x 3]) — keep same setup, gather more data
  B. Adjust and retest — change [the specific weakest element] and run 3 more days
  C. Kill — signal too weak to justify more spend

Your call. Reply with A, B, or C.
\`\`\`

**KILL:**
\`\`\`
FINAL VERDICT: KILL

[Idea Name] did not show viable market signal:
  - [Key evidence 1: e.g., "CTR 0.4% across all 3 ads — below 0.8% minimum"]
  - [Key evidence 2: e.g., "$52 spent, 0 email signups"]

Total invested: $[total_spend] over [days] days
Learning: [One sentence — what this test revealed. E.g., "This market may not be reachable via Meta ads" or "Pain point was real but the promise didn't resonate"]

This idea is archived. The learning is saved.
Run /rapid-test [your next idea] to test another one.
Run /rapid-status to see your full test portfolio.
\`\`\`

### Step 8: Update Pipeline State

Append daily check entry to \`rapid_tests.[slug].daily_checks\`:
\`\`\`json
{
  "date": "[today]",
  "day_number": [X],
  "spend": [X],
  "impressions": [X],
  "clicks": [X],
  "conversions": [X],
  "ctr": [calculated],
  "cpc": [calculated],
  "cost_per_conversion": [calculated or null],
  "verdict": "[collecting_data|signal|watching|no_signal|graduate|continue|kill]",
  "notes": "[any user-provided context or observations]"
}
\`\`\`

Update \`rapid_tests.[slug].aggregate_metrics\` with new cumulative values.

On final verdict:
- Update \`rapid_tests.[slug].status\` to \`"graduated"\`, \`"extended"\`, or \`"killed"\`
- Update \`rapid_tests.[slug].verdict\` to \`"graduate"\`, \`"continue"\`, or \`"kill"\`
- For GRADUATE and KILL: auto-trigger \`/lessons capture\` with the test data (what worked, what didn't, market characteristics)

On CONTINUE option A (extend):
- Add \`duration_days\` to the existing duration
- Update \`end_date\`
- Set status to \`"active"\` (stays active)

On CONTINUE option C (user kills):
- Process as KILL verdict above

### Step 9: Early Kill Handling

If the user says "kill" or "kill it" or "stop this test" at any point (not just end of window):
- Calculate remaining budget saved: $[budget - total_spend]
- Process as KILL verdict
- Present: "Killed [idea name]. Saved $[remaining]. Run /rapid-test with your next idea."

## Rules
- At $15/day, daily fluctuations ARE the data. Don't wait for 7-day trends like the full pipeline does at $50/day. Focus on absolute thresholds, not trajectory.
- NEVER recommend rebuilding the landing page or overhauling the campaign mid-test. The test is 3-5 days. Either signal exists or it doesn't. The only mid-test adjustment allowed is pausing the worst-performing ad to concentrate budget on the others.
- If user hasn't run /rapid-check and the test window has passed, flag it: "Your [idea name] test window ended on [date]. Run /rapid-check with your final numbers to get a verdict."
- After a KILL verdict, always suggest the next action: "Run /rapid-test [idea] to test your next one."
- After a GRADUATE verdict, always suggest: "Run /rapid-graduate [market-slug] to enter the full pipeline."

## Autonomy
Tier 1 — Full Auto for daily check analysis and state updates.
Tier 2 — Notify & Proceed for GRADUATE verdict.
Tier 3 — Recommend & Wait for CONTINUE verdict (user chooses path).
Tier 4 — Escalate for KILL only if user has killed 3+ consecutive ideas with zero conversions across all of them (pattern suggests a deeper issue — recommend stepping back to do one full /scout to recalibrate).

## Output
Inline verdict. State updated in pipeline-state.json. No separate file created — daily checks are tracked in pipeline state.

## Next Step
- Daily during window → \`/rapid-check\` again
- GRADUATE → \`/rapid-graduate [market-slug]\`
- CONTINUE → extend, adjust, or kill per user choice
- KILL → \`/rapid-test [next idea]\` or \`/rapid-status\` to review portfolio`;
