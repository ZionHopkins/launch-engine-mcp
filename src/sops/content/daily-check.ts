export const DAILY_CHECK = `# /daily-check — Daily Operations Pulse

## What This Does

Five-minute daily operating protocol for any stage with live campaigns or active traffic. Paste numbers, get diagnosis, get one action. Covers all active channels and campaign types, not just validation.

## Trigger Context
Any day you have money being spent on ads or active campaigns running. Use this as your daily operating rhythm.

## Execution Protocol

### Step 1: Accept Data

Accept data in any format. Ideal format:

\`\`\`
Date: [today]
Total spend today: $
Total revenue today: $
Clicks:
Conversions:
Notable: [anything unusual — platform issues, big spike, zero delivery, etc.]
\`\`\`

But also accept: conversational descriptions, pasted dashboard tables, partial data, or even "nothing happened today."

### Step 2: Load Active Context

Read pipeline-state.json for:
- Current stage (validation, scaling, steady-state)
- Active channels and campaigns
- Financial guardrails (from /unit-economics)
- Recent /daily-check history (last 7 entries)
- Any active creative tests (from /creative-test)
- Any active funnel tests (from /funnel-optimize)
- Scale protocol status (from /scale)

### Deadline & Revenue Phase Alerts

Before generating the daily pulse, check:

**Deployment Deadline** (if deployment_deadline_at exists):
- If deadline is in the future and <24 hours: prepend WARNING to output
- If deadline has passed and deployment_initiated_at is null: flag "Deployment deadline passed"

**Revenue Phase** (if revenue_phase exists):
- Include current revenue_phase in the status line
- If in "signal" phase >7 days with traffic: flag "No signal yet"
- If in "cash" phase >14 days: flag "Signal but no sale"

### Step 3: Output — Maximum 10 Lines

Structure (adapt based on what's active):

\`\`\`
DAY [X] — [date]
Spend: $[today] ($[cumulative this week/month])  |  Revenue: $[today]  |  ROAS: [X]x

[ONE STATUS LINE per active campaign/test:]
Meta Campaign: [STATUS] CPA $[X] (target $[Y]) — [one-word assessment]
Creative Test Batch [N]: [STATUS] [leader so far + key metric]
Funnel Test: [STATUS] [which test + current result]

ACTION: [one specific thing to do today — or "Hold steady, no changes needed."]

Tomorrow: [what to watch for]
\`\`\`

Status labels:
- [OK] On track / profitable
- [WARN] Watch / borderline
- [CRITICAL] Problem / needs attention
- [PAUSED] Paused
- [NEW] Just launched (insufficient data)

### Step 4: Intelligent Alerting

Only flag items that need attention. Don't report on things that are fine unless the user asks. Prioritize:

1. **Anything hitting a kill threshold** → Immediate flag with specific action
2. **Anything showing a 3+ day degrading trend** → Warning with context
3. **Anything newly profitable** → Celebrate briefly, note for scaling consideration
4. **Budget pacing** → Flag if daily spend is significantly under or over target

### Step 5: Weekly Roll-Up (Every 7th Check)

On every 7th consecutive daily check, automatically append a mini roll-up:

\`\`\`
WEEK [N] SUMMARY
Total spend: $[X]  |  Total revenue: $[X]  |  ROAS: [X]x  |  Profit: $[X]
Best day: [date] — [why]
Worst day: [date] — [why]
Trend: [improving / stable / declining]
Key learning: [one sentence — what did this week teach you?]
Organic: [only if organic_growth exists in pipeline state] GSC clicks this week: [X] | Next /seo-check due: [date]
Recommendation: [one of: keep running / run /creative-test / run /funnel-optimize / run /scale / run /traffic-analytics for deep dive]
\`\`\`

### Step 6: Update State

Append to daily operations log in pipeline-state.json.

## Rules
- Maximum 10 lines for daily output. Density over length.
- One action only. If multiple things need attention, prioritize the highest-leverage one.
- Never recommend wholesale changes from one day's data.
- If the user provides no data: remind them what to check and where to find it. Don't guilt-trip. Keep it light.
- If there's truly nothing to report: "All systems normal. No action needed. Check again tomorrow." That's a valid output.

## Autonomy
Tier 1 — Full Auto. Pure information delivery. No decisions required.

## Output
Inline daily pulse. No file saved. State updated in pipeline-state.json.

## Next Step
Continue daily rhythm. Route to specific commands only when action line warrants it.`;
