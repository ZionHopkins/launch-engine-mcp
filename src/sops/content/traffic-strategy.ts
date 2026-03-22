export const TRAFFIC_STRATEGY = `# /traffic-strategy — Traffic Strategy Engine

## What This Does

Analyzes your market, buyer, campaign assets, and budget to create a channel-specific traffic strategy.

## Trigger Context
After Campaign Deployment Engine has produced assets. Assets exist but no traffic is flowing yet.

## Prerequisites
- Campaign assets built (landing pages, emails, ad copy from /deploy)
- Buyer Research Package (personas, awareness level, sophistication level)
- Platform Decision (from /platform)
- Product Blueprint (from /product)
- User-provided budget constraint (ask if not provided)

## Execution Protocol

**DELEGATE TO SUBAGENT: \`traffic-agent\` (task_type: "traffic_strategy_research")**

### Step 0: Gather inputs
Collect and pass to subagent:
- Building Blocks document (\`assets/[market-name]/building-blocks/building-blocks.md\`)
- Buyer Research Package (\`assets/[market-name]/research/buyer-research-package.md\`)
- Unit Economics guardrails (from \`pipeline-state.json\`)
- Platform decision (\`assets/[market-name]/research/platform-decision.md\`)
- Dream 100 data (if \`/dream-100\` has run: \`assets/[market-name]/traffic/dream-100/dream-100-analysis.md\`)
- User-provided budget constraint (ask if not provided)

### Step 1: Invoke traffic-agent subagent
The subagent will run 5-8 web searches for channel benchmarks, score channels across 5 dimensions, allocate budget via 70/20/10 rule, set KPI targets, and define the testing sequence.

### Step 2: Receive and save output
The subagent returns the Traffic Strategy Document. Save to \`assets/[market-name]/traffic/traffic-strategy.md\`.

The document must include these EXACT deliverables:

   **A. Channel Scorecard** — completed matrix with numerical scores and evidence for each dimension. Include an **Organic** row scoring organic search/content as a channel (Buyer Presence, Intent Strength, Creative-Channel Fit, Cost Efficiency, Scalability). This row is informational — organic runs parallel via \`/content-engine\`, not competing for paid budget.

   **B. Budget Allocation Table (copy-paste ready):**
   \`\`\`
   MONTHLY BUDGET: $[total] (PAID CHANNELS ONLY)

   PROVEN (70%):    [Channel]  $[amount]/month  $[amount]/day
   TESTING (20%):   [Channel]  $[amount]/month  $[amount]/day
   EXPERIMENT (10%): [Channel]  $[amount]/month  $[amount]/day

   ORGANIC (parallel — no budget allocation, runs via /content-engine):
     Status: [active/not started]
     Channel: SEO + AI citations
     Monthly cost: $0 (time investment only)
     Expected timeline: 3-6 months to compound
   \`\`\`

   **C. KPI Target Card (reference during every analytics review):**
   \`\`\`
   TARGET METRICS:
   Break-even CPA: $[exact number] (= offer price × margin threshold)
   Target CPA: $[exact number] (= break-even × 0.7 for profit margin)
   Target ROAS: [X.X]x minimum
   CTR floor: [X.X]% (below this = kill creative)
   Landing page conv rate target: [X]%
   Daily conversion target: [X] sales/day at $[budget]/day
   \`\`\`

   **D. Testing Sequence (week-by-week launch plan):**
   \`\`\`
   WEEK 1: Launch [channel] with [X] creative variations at $[X]/day each
           Kill threshold: [specific metric and number]
           Advance threshold: [specific metric and number]
   WEEK 2: Advance winners to validation. Launch [X] new variations.
           Start [testing channel] with [X] variations at $[X]/day.
   WEEK 3: Scale validated winners. Analyze testing channel signal.
   WEEK 4: Full analytics review. Rebalance 70/20/10 if needed.
   \`\`\`

   Save to \`assets/[market-name]/traffic/traffic-strategy.md\`

7. **Update pipeline-state.json** with traffic strategy data.

## Autonomy
Tier 2 — Notify & Proceed for strategy creation.
Tier 3 — Recommend & Wait for budget decisions above $100/day.

## Next Step
\`/channels\` to set up campaigns, or \`/creative-test\` to begin testing.`;
