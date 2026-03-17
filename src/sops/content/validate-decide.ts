export const VALIDATE_DECIDE = `# /validate-decide — Validation Verdict Engine

## What This Does

End-of-window validation verdict. Aggregates all daily check data into a comprehensive signal analysis and produces a clear decision with automatic pipeline routing.

## Trigger Context
- Validation window end date reached (from /validate-prep)
- User triggers manually
- Kill signal from /validate-check (early termination)

## Execution Protocol

### Step 1: Aggregate All Data

Pull from pipeline-state.json:
- All daily check entries for current validation tier
- Decision thresholds from /validate-prep
- Unit economics guardrails
- Current tier number

Calculate aggregate metrics:
\`\`\`
VALIDATION SUMMARY — Tier [N] — [Market Name]
Window: [start date] to [end date] ([X] days)

AGGREGATE METRICS:
  Total Spend: $[sum]
  Total Impressions: [sum]
  Total Clicks: [sum]
  Overall CTR: [calculated]%
  Total Signups/Leads: [sum]
  Cost Per Lead: $[calculated]
  Total Sales: [sum]
  CPA: $[calculated]
  ROAS: [calculated]x (if revenue data exists)

TREND:
  CPA trajectory: [improving / stable / degrading]
  CTR trajectory: [improving / stable / degrading]
  Best performing day: [date] — [why]
  Worst performing day: [date] — [why]

CREATIVE PERFORMANCE:
  Ad 1: [metrics] — [winner / loser / inconclusive]
  Ad 2: [metrics] — [winner / loser / inconclusive]
\`\`\`

### Step 2: Compare Against Tier-Specific Criteria

**Tier 1 (Signal Validation) — Did anyone care?**
\`\`\`
ADVANCE criteria (ALL must be met):
  ☐ Email signups achieved: [actual] vs [minimum threshold]
  ☐ Cost per signup: $[actual] vs $[maximum acceptable]
  ☐ Landing page engagement: [scroll depth / time on page if available]
  ☐ At least one ad variation showed viable CTR (above kill threshold)

ITERATE criteria (some signal, not enough):
  ☐ Some signups but below threshold
  ☐ CTR viable on at least one ad but conversion weak
  ☐ Engagement signals present but action signals absent

KILL criteria (no signal):
  ☐ Zero or near-zero signups after full budget spent
  ☐ All ads below CTR kill threshold
  ☐ No engagement signals whatsoever
\`\`\`

**Tier 2 (Micro-Validation) — Will anyone pay?**
\`\`\`
ADVANCE criteria:
  ☐ Sales achieved: [actual] vs [minimum — typically 3-5 at this tier]
  ☐ CPA: $[actual] vs $[target from unit economics]
  ☐ Refund rate: [actual] vs [<20% threshold]
  ☐ Module 1 completion: [actual] vs [>50% threshold]

ITERATE criteria:
  ☐ Some sales but CPA above target
  ☐ Sales but high refund rate
  ☐ Leads converting but volume insufficient

KILL criteria:
  ☐ Zero sales after full validation spend
  ☐ CPA > 2x break-even with no improving trend
  ☐ High refund rate indicating fundamental mismatch
\`\`\`

**Tier 3 (Real Validation) — Is this a business?**
\`\`\`
ADVANCE criteria (→ scaling mode):
  ☐ CPA stable at or below target for 7+ days
  ☐ ROAS above break-even consistently
  ☐ Refund rate <10%
  ☐ Product completion rate >60%
  ☐ At least 2 winning creative variations validated
  ☐ Unit economics sustainable at current scale

ITERATE criteria:
  ☐ Profitable but inconsistent
  ☐ One channel working, others not
  ☐ Creative fatigue setting in

KILL criteria:
  ☐ Unable to achieve target CPA after full optimization cycle
  ☐ Product-market fit signals absent (high refunds, no completion, no testimonials)
\`\`\`

### Step 3: Produce Verdict

**ADVANCE:**
\`\`\`
VERDICT: ✅ ADVANCE TO TIER [N+1]

Evidence:
  [2-3 bullet points citing specific metrics that met thresholds]

What happens next:
  - Pipeline auto-advances to Tier [N+1]
  - /validate-prep will generate Tier [N+1] deployment package
  - Winning ad variation(s) carry forward: [which ones]
  - Budget increases to: $[tier N+1 budget]

Learnings captured:
  - Winning hook angle: [which Building Block led]
  - Best performing audience: [from ad set data]
  - Landing page conversion rate: [X]% [above/below benchmark]
\`\`\`

If advancing from Tier 3 → scaling mode:
\`\`\`
VERDICT: ✅ VALIDATED — ENTER SCALING MODE

This market has passed all three validation tiers.
Pipeline transitions to continuous optimization:
  → /creative-test for ongoing creative testing
  → /scale for budget scaling
  → /traffic-analytics for periodic reviews
  → /daily-check continues as monitoring tool
\`\`\`

**ITERATE:**
\`\`\`
VERDICT: 🔄 ITERATE — [specific issue identified]

Evidence:
  [what the data shows]

Root cause diagnosis:
  [specific component that underperformed — not vague]

Routing:
  [exact SOP to re-run and what to change]
  - If creative problem → /creative-test with [specific angle to test]
  - If landing page problem → /funnel-optimize targeting [specific section]
  - If offer problem → /feedback routing to Building Blocks revision
  - If targeting problem → /channels with adjusted audience parameters

Re-validation plan:
  After fixes, re-run Tier [N] with:
  - Budget: $[same as before]
  - Duration: [X] days
  - Changed variables: [list exactly what's different]
  - /validate-prep will auto-generate new deployment package
\`\`\`

**KILL:**
\`\`\`
VERDICT: ❌ KILL — [reason]

⚠️ This is a Tier 4 decision. Presenting analysis for your decision.

Evidence:
  [what the data conclusively shows]

Why this isn't an iteration problem:
  [distinguish between fixable tactical issues vs fundamental misalignment]

Total investment in this pipeline:
  Time: [approximate hours across all SOPs]
  Money: $[total ad spend across all tiers]

Learnings to capture (→ /lessons):
  - [What worked that transfers to future pipelines]
  - [What the market taught you about buyer behavior]
  - [What you'd do differently with hindsight]

Options:
  A. Archive this pipeline. Start /scout with a new market.
  B. Pivot to adjacent market: [suggest based on what the data revealed]
  C. Fundamental repositioning: return to /research with new angle on same market.

Your call. Which option?
\`\`\`

### Step 4: Execute Pipeline Transition

Based on verdict:
- **ADVANCE:** Update pipeline-state.json to next tier. Auto-trigger /validate-prep for next tier.
- **ITERATE:** Update pipeline-state.json with iteration entry. Present the specific SOP to re-run.
- **KILL:** Wait for user confirmation (Tier 4). On confirmation, archive pipeline to \`pipelines/archive/\`, auto-trigger \`/lessons\` to capture learnings.

### Step 5: Update State

\`\`\`json
{
  "validation_tier_[N]": {
    "status": "[advanced/iterating/killed]",
    "completed_at": "[timestamp]",
    "verdict": "[advance/iterate/kill]",
    "evidence_summary": "[brief]",
    "signals": {
      "total_spend": [X],
      "total_conversions": [X],
      "final_cpa": [X],
      "winning_creative": "[which]",
      "winning_audience": "[which]"
    },
    "routing": "[next SOP or archive]"
  }
}
\`\`\`

## Autonomy
Tier 2 — Notify & Proceed for ADVANCE verdict.
Tier 3 — Recommend & Wait for ITERATE verdict (user approves iteration plan).
Tier 4 — Escalate for KILL verdict (user must confirm).

## Output
Validation Verdict Report saved to \`assets/[market-name]/validation/tier-[N]-verdict.md\`
Pipeline state updated. Next step auto-initiated or presented for approval.

## Next Step
ADVANCE → \`/validate-prep\` (next tier) or scaling mode
ITERATE → Routed SOP (e.g., \`/creative-test\`, \`/funnel-optimize\`, \`/feedback\`)
KILL → \`/lessons\` then \`/scout\` (new market)`;
