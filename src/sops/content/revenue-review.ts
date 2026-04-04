export const REVENUE_REVIEW = `
# Revenue Review — Weekly Revenue Phase Assessment

## What This Does
Weekly check-in on selected pipelines comparing actual revenue to projections. If revenue phase tracking is enabled (revenue_phase is set), manages phase transitions. Routes iteration when behind projections.

## Trigger Context
Run weekly. Applies to pipelines with triage_status "selected" (or all pipelines if no triage has been done).

## Execution Protocol

### Step 0: Load Selected Pipelines (Tier 1 — Auto)
Read pipeline-state.json. Load pipelines where triage_status == "selected". If no triage has been done, load all active pipelines.

For each, gather:
- revenue_phase (current phase, if set)
- revenue_phase_gates (gate statuses)
- revenue_milestones (milestone dates)
- deployment_initiated_at (when deployed)
- deployment_deadline_at (if active)
- validation tier metrics (spend, clicks, signups, conversions)
- traffic performance (revenue, ROAS)
- unit economics projections (LTV, target CPA, financial guardrails)

### Step 1: Revenue Phase Status (Tier 1 — Auto)
For each pipeline, present:
- Current phase (if revenue_phase is set)
- Days active since deployment
- Money out (total spend across channels)
- Money in (total revenue)
- Net (revenue minus spend)
- Next gate (what needs to happen to advance)

### Step 2: Revenue Phase Gate Check (Tier 2 — Notify & Proceed)
If revenue_phase is set, check against current phase gate:

**Signal Phase** — Has anyone expressed intent to buy?
- Evidence: email signups, waitlist joins, deposits, DM responses
- If YES: suggest advancing to "cash" phase
- If NO after 7+ days with traffic: flag for review

**Cash Phase** — Has anyone actually paid?
- Evidence: completed sale, payment received
- If YES: suggest advancing to "repeat" phase, record first_sale_at
- If NO after 14+ days: flag pricing, checkout, or offer strength

**Repeat Phase** — Can you do it again?
- Evidence: 3+ sales at same price from different customers
- If YES: suggest advancing to "scale" phase
- If NO after 21+ days: flag whether first sale was warm network only

**Scale Phase** — At target MRR?
- Evidence: sustained monthly recurring revenue
- If YES: suggest marking pipeline complete
- If plateau: route to scale for budget expansion

Phase transitions are suggestions — confirm with user before updating state.

### Step 3: Behind-Projection Routing (Tier 3 — Recommend & Wait)
If behind projections, suggest specific actions:

| Symptom | Days | Suggested Action |
|---------|------|-----------------|
| No signal, traffic running | 7+ | creative_test or feedback |
| Signal but no sale | 14+ | funnel_optimize or bold_action |
| First sale but no repeat | 21+ | Revisit build_blocks or increase traffic |
| Sales but revenue flat | 30+ | scale or add revenue stream |
| Zero signal, zero interest | 14+ | Consider archiving via portfolio_triage |

Present the recommendation and wait for user decision before routing.

### Step 4: Weekly Summary (Tier 1 — Auto)
Output summary per pipeline:
- Phase status (current and any advancement)
- Revenue this week / total
- Status assessment (ON TRACK / BEHIND / CRITICAL)
- Specific next action

Portfolio total: combined revenue vs combined spend.
Next review date.

### Step 5: Update State (Tier 1 — Auto)
After user confirms any transitions:
- Update revenue_phase and revenue_phase_gates
- Update revenue_milestones with dates
- If archiving: set triage_status "archived", suggest capturing learnings via lessons

## Output
Summary displayed inline. State changes written to pipeline-state.json.

## Relationship to Other Tools
- Complements daily_check (which remains operational pulse for active campaign days)
- Feeds into feedback when iteration is needed
- Triggers portfolio_triage when archiving opens a slot
- Triggers lessons when killing or advancing a pipeline
`;
