export const SCALE = `# /scale — Scale Protocol

## What This Does

Rules-based scaling system. Determines readiness, selects scaling mode, defines guardrails, and prevents premature scaling from destroying profitable campaigns.

## Trigger Context
Creative testing has produced validated winners. Funnel conversion is at or above benchmark. User wants to increase spend or open new channels.

## Execution Protocol

### Step 1: Scale Readiness Audit
Before ANY scaling action, verify ALL criteria are met:

- [ ] CPA stable (within 15% of target) for 7+ consecutive days
- [ ] Minimum 30 conversions on winning creative (statistical confidence)
- [ ] Break-even ROAS consistently exceeded (not just occasionally)
- [ ] Landing page conversion rate at or above benchmark
- [ ] At least 2 validated creative variations exist (fatigue redundancy)
- [ ] Email nurture sequence active and converting non-buyers (backend revenue)

**If ANY checkbox is unmet:** STOP. Identify which criterion fails. Route to the appropriate fix (/creative-test, /funnel-optimize, or Execution OS /feedback) before scaling.

Present the audit results to the user. This is a Tier 3 decision — user must approve scaling.

### Step 2: Select Scaling Mode

**Vertical Scale** — More budget, same audience + creative
- When: Winning combo is stable and profitable. Frequency < 2.0. CPA headroom exists.
- How: Increase daily budget 20-30% per day maximum. Never double overnight.
- Guardrail: If CPA exceeds target by 30%+ after increase, hold 48 hours. If still above after 48h, revert to last stable budget.
- Ceiling: Stop when frequency reaches 3.0 or CPA hits break-even.

**Horizontal Scale** — Same budget, new audiences
- When: Current audience is saturating. Frequency rising, CTR declining, CPM increasing.
- How: Test new audience segments: broader lookalikes, new interest groups, new demographics. Same winning creative.
- Guardrail: New audiences get testing-level budget (not full scaling budget) until they prove comparable performance over 5-7 days.

**Creative Scale** — New variations, same system
- When: Audiences are responding but creative fatigue is setting in (CTR declining 20%+ over 7 days).
- How: Produce 3-5 new iterations of winning hook angle. Different execution, same core message. Run through /creative-test Phase 1-2.
- Guardrail: Never retire all old creatives simultaneously. Overlap new and old for transition.

**Channel Scale** — New platform, proven system
- When: Primary channel is fully optimized. Marginal gains are diminishing.
- How: Graduate testing channel (20% allocation) to proven (70%). Open new experimental channel (10%).
- Guardrail: New channel gets full /traffic-strategy + /channels treatment before budget commitment.

### Step 3: Implement & Monitor

For whichever mode is selected, produce an EXACT ACTION SPEC:

\`\`\`
SCALING ACTION — [Date]
Mode: [Vertical / Horizontal / Creative / Channel]

EXACT CHANGES TO MAKE:
  Campaign: [exact campaign name from /channels setup]
  Ad Set: [exact ad set name]
  Current Daily Budget: $[current]
  New Daily Budget: $[new] (= [X]% increase)
  — OR —
  New Audience: [exact targeting spec, same format as /channels]
  — OR —
  New Creatives: [reference batch from /creative-test]
  — OR —
  New Channel: [reference /traffic-strategy testing channel]

MONITORING CHECKPOINTS:
  Day 1: Check CPA at [time]. If CPA > $[threshold] → note but hold.
  Day 2: Check CPA. If CPA > $[threshold] for 2 consecutive days → hold.
  Day 3: Check CPA. If CPA > $[threshold] for 3 days → REVERT to $[previous budget].
         If CPA ≤ $[target] → HOLD at current level for 4 more days before next increase.

REVERSION TRIGGER:
  If CPA exceeds $[exact number] (= target × 1.3) for 48 hours → set budget back to $[exact number]
  If ROAS drops below [X.X]x for 48 hours → set budget back to $[exact number]
  If frequency exceeds 3.0 → pause audience expansion, rotate to /creative-test

NEXT SCALING WINDOW:
  If this action succeeds (CPA stable for 7 days at new level):
  Next increase: $[current new] → $[next level] (another [X]% increase)
  Date to evaluate: [exact date, 7 days from implementation]
\`\`\`

Save the action spec to \`assets/[market-name]/traffic/scale-actions/scale-[date].md\`
Update pipeline-state.json with the scaling decision and scheduled checkpoints.

### Step 4: Rebalance 70/20/10

After each scaling cycle, rebalance the budget allocation:
- Testing channel that proved profitable → Graduate to proven (70%)
- Experimental channel that showed signal → Graduate to testing (20%)
- Failed experiments → Document learnings, close, open new experiment
- Proven channel that degraded → Diagnose (is it fixable or exhausted?)

Present rebalanced allocation to user for approval (Tier 3).

## Scaling Rules (Non-Negotiable)
1. Max 20-30% daily budget increase. Larger jumps reset learning.
2. CPA spike after increase → Hold 48h → Revert if not stabilized.
3. Scale horizontally before vertically. New audiences before more money on same audience.
4. Never scale a single creative. Scale the system — multiple creatives, audiences, placements.
5. New channels only after primary is optimized and profitable.

## Output
Scaling plan + monitoring dashboard saved to \`assets/[market-name]/traffic/scale-plan.md\`
Pipeline-state.json updated with scaling decisions and results.

## Autonomy
Tier 3 — Recommend & Wait for all scaling decisions. User approves before execution.
Tier 4 — Escalate if total spend change exceeds 50% of current budget.

## Next Step
Continuous cycle: /scale → monitor → /creative-test (new batch) → /funnel-optimize → /scale`;
