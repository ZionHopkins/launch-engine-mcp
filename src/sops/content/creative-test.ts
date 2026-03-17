export const CREATIVE_TEST = `# /creative-test — Creative Testing Protocol

## What This Does

Systematic three-phase creative testing framework. Produces variations, defines kill/scale rules, and manages the continuous testing flywheel.

## Trigger Context
After /channels has set up campaign structure. Campaigns are ready to launch or are running.

## Execution Protocol

### MODE 1: Generate New Test Batch
When user needs new creatives to test:

1. **Pull existing ad copy variations** from \`assets/[market-name]/campaigns/\`
2. **Identify which Building Block each variation leads with:**
   - Hook A: Leads with BIG PROBLEM (pain-first)
   - Hook B: Leads with UNIQUE MECHANISM (curiosity-first)
   - Hook C: Leads with BIG PROMISE (outcome-first)
   - Hook D: Leads with PROOF (credibility-first)
   - Hook E: Leads with CONTRARIAN BELIEF (pattern-interrupt)
3. **Generate 3-5 new variations as PLATFORM-READY copy blocks.** Every variation output in this exact format, per platform:

**Meta Ad Copy Block (copy-paste ready):**
\`\`\`
VARIATION [N]: [Hook Angle Label]
Building Block Lead: [which BB this leads with]

Primary Text (125 chars above fold / 500 max):
[exact copy]

Headline (40 chars max):
[exact copy]

Description (30 chars max):
[exact copy]

CTA Button: [Shop Now / Learn More / Sign Up / Get Offer]

---

VARIATION [N+1]: [Hook Angle Label]
[same format]
\`\`\`

**Google Search Ad Copy Block (copy-paste ready):**
\`\`\`
VARIATION [N]: [Hook Angle Label]
Responsive Search Ad Headlines (30 chars max each):
  H1: [headline]
  H2: [headline]
  H3: [headline]
  H4: [headline]
  H5: [headline]
  [minimum 8, max 15]

Descriptions (90 chars max each):
  D1: [description]
  D2: [description]
  D3: [description]
  D4: [description]

Display Path: /[path1]/[path2]
\`\`\`

**YouTube Script Block (read-and-record ready):**
\`\`\`
VARIATION [N]: [Hook Angle Label]
Total length: 30s / 60s / 90s

[0:00-0:05] HOOK: "[exact words to say on camera]"
[0:05-0:15] PROBLEM: "[exact words]"
[0:15-0:30] MECHANISM: "[exact words]"
[0:30-0:45] PROOF: "[exact words]"
[0:45-0:XX] CTA: "[exact words including URL mention]"

On-screen text overlays:
  [0:02] "[overlay text]"
  [0:20] "[overlay text]"
  [0:XX] "[CTA overlay]"
\`\`\`

4. **Each variation must:**
   - Lead with a different hook angle
   - Use 2-3 Language Bank phrases (flagged in bold within the copy)
   - Stay within exact character limits for the target platform
   - Be distinctly different from previously tested creatives
5. **Save variations** to \`assets/[market-name]/traffic/creative-tests/batch-[N]/\`
6. **Auto-run \`/qa\` in CREATIVE MODE** on the new batch before it enters testing. QA checks persona alignment on all new variations. If BLOCKED, correct and re-check before spending money.
7. **Output a test launch card per variation (after QA clearance):**
\`\`\`
LAUNCH CARD — Variation [N]
Platform: [Meta / Google / YouTube]
Ad Set: [which ad set from /channels setup]
Budget: $[exact amount]/day (= [X]x target CPA)
Run for: 3 days minimum
Phase 1 metrics to watch: [CTR, CPM, hook rate — with specific thresholds]
KILL if: [specific threshold, e.g., CTR < 0.8% after 1000 impressions]
ADVANCE if: [specific threshold, e.g., top 2 by CTR after 72 hours]
\`\`\`

### MODE 2: Analyze Test Results
When user provides performance data from a running test:

1. **Classify each creative by phase:**

**Phase 1 Metrics (Days 1-3):**
   - CTR: Is it above account average?
   - CPM: Is it competitive for this audience?
   - Hook rate (video): Do people stop scrolling?
   - 3-second view rate (video): Do they watch past the hook?
   - VERDICT: Kill (below thresholds) or Advance to Phase 2

**Phase 2 Metrics (Days 4-7):**
   - CPA: Is it within 120% of target?
   - ROAS: Is it above break-even?
   - Conversion rate: Is traffic converting?
   - VERDICT: Kill (CPA > 2x target for 3 days) or Validate (CPA stable within target)

**Phase 3: Scaling (Day 8+):**
   - Validated winner enters scaling budget
   - Generate 2-3 iterations (same hook angle, different execution)
   - Monitor for fatigue signals (CTR declining 20%+ over 7 days)

2. **Generate Creative Performance Report:**
   - Rank all tested creatives by primary KPI
   - Identify winning hook angle (which Building Block drives best results)
   - Document learnings (what type of hook, format, and angle works for this market)
   - Recommend next test batch based on learnings

3. **Save report** to \`assets/[market-name]/traffic/creative-tests/report-[date].md\`
4. **Update pipeline-state.json** with creative test results.
5. **If clear winners or losers identified**, auto-trigger \`/lessons capture\` with category \`creative\` — document which hook angles, formats, and Building Block leads performed best/worst for this market.

### KILL RULES (Automated)
- CPA > 2x target for 3 consecutive days → PAUSE
- CTR < 50% of account average after 1000 impressions → KILL
- CTR decline > 20% over 7 days → FATIGUE ALERT (rotate hooks, don't just re-upload)
- Spend > 3x target CPA with zero conversions → KILL
- Frequency > 3.0 on any ad set → AUDIENCE SATURATION (expand or rotate)

## Autonomy
Tier 1 — Full Auto for creative generation and analysis.
Tier 2 — Notify & Proceed for kill/advance recommendations.
Tier 3 — Recommend & Wait before pausing campaigns spending above $50/day.

## Next Step
Winners feed into \`/scale\`. Losers inform next \`/creative-test\` batch.
Conversion-chain issues route to \`/funnel-optimize\`.`;
