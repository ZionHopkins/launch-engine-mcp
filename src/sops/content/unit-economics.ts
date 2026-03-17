export const UNIT_ECONOMICS = `# /unit-economics — Unit Economics Gate

## What This Does

Calculates whether a market is viable at your current budget by working backward from offer price to required traffic metrics. Prevents building assets for markets where the math doesn't work.

## Trigger Context
After Stress Test → GO, BEFORE Platform/Product. This is a gate — if the math fails, you don't build.

## Prerequisites
- Building Blocks (specifically: offer price from Block 3)
- Market Intelligence Report (industry CPA benchmarks)
- Buyer Research Package (awareness/sophistication levels → conversion rate estimates)
- User's daily budget (ask if not provided)

## Execution Protocol

### Step 1: Define Core Numbers
Collect or calculate:

\`\`\`
REVENUE MODEL:
  Product Price: $[from Building Block 3 — Irresistible Offer]
  Estimated COGS per sale: $[hosting, tools, delivery costs]
  Gross Margin per sale: $[price - COGS]
  Target Profit Margin: [default 50% of gross margin]

BUDGET CONSTRAINTS:
  Daily Ad Budget: $[user provides]
  Monthly Ad Budget: $[daily × 30]
  Validation Budget (Tier 1): $[7 days × daily budget]
\`\`\`

### Step 2: Work Backward to Maximum Sustainable CPA

\`\`\`
BREAK-EVEN CPA: $[Gross Margin per sale]
  → This is the absolute ceiling. Above this, you lose money on every sale.

TARGET CPA: $[Gross Margin × (1 - Target Profit Margin)]
  → This is what you need to sustain profitability.

STRETCH CPA: $[Break-even × 1.2]
  → During validation ONLY, you can tolerate up to 20% above break-even
    to gather learning data. Not sustainable long-term.
\`\`\`

### Step 3: Reality Check Against Market Benchmarks

Pull benchmark data from Market Intelligence Report:
- Industry average CPA for this market
- Platform-specific CPA ranges (Meta, Google, YouTube)
- Competitor pricing (inferred from their ad spend patterns)

\`\`\`
VIABILITY MATRIX:
  Your Target CPA: $[calculated above]
  Industry Avg CPA: $[from market intel]
  Gap: [your target vs industry avg — expressed as %]

  IF your target CPA > industry avg: GREEN — math works with room
  IF your target CPA is within 20% of industry avg: YELLOW — tight but viable
  IF your target CPA < industry avg by 20%+: RED — you need either higher price,
     lower costs, or a different market
\`\`\`

### Step 4: Budget-to-Learning Velocity Check

This answers: "At $X/day, how long until I have enough data to make real decisions?"

\`\`\`
DATA VELOCITY:
  Estimated CTR: [based on awareness level — high awareness 2-3%, low 0.8-1.5%]
  Estimated CPC: $[daily budget implications at estimated CTR and market CPM]
  Daily Clicks: [daily budget / CPC]
  Estimated Conversion Rate: [based on sophistication level — Level 1: 3-5%, Level 5: 0.5-1.5%]
  Daily Conversions (estimated): [daily clicks × conversion rate]
  Days to 30 Conversions (statistical confidence): [30 / daily conversions]

  IF days to 30 conversions ≤ 14: GREEN — you'll learn fast enough
  IF days to 30 conversions = 15-30: YELLOW — viable but patience required
  IF days to 30 conversions > 30: RED — budget too low for this market's economics
     → Options: raise budget, raise price, find lower-CPC channel, or find different market
\`\`\`

### Step 5: Scenario Modeling

Present three scenarios:

\`\`\`
OPTIMISTIC (top 25% performance):
  CPA: $[target × 0.7]  |  Daily Sales: [X]  |  Daily Profit: $[X]  |  Monthly: $[X]
  Time to validate: [X] days

REALISTIC (median performance):
  CPA: $[target]  |  Daily Sales: [X]  |  Daily Profit: $[X]  |  Monthly: $[X]
  Time to validate: [X] days

PESSIMISTIC (bottom 25% performance):
  CPA: $[break-even × 1.3]  |  Daily Sales: [X]  |  Daily Loss: $[X]
  Maximum validation burn before kill: $[X] over [X] days
  → This is your WORST CASE learning cost. Can you absorb this?
\`\`\`

### Step 6: Verdict

- **VIABLE** — All checks green or yellow. Proceed to Platform + Product.
- **TIGHT** — One or more yellow flags. Proceed with documented constraints. Set hard budget caps and shorter validation windows.
- **NON-VIABLE AT CURRENT SCALE** — One or more red flags. Present options:
  - Raise product price (recalculate with new numbers)
  - Increase daily budget (show what budget would make it viable)
  - Find lower-CPC traffic channel (organic, content, partnerships)
  - Pivot to adjacent market with better economics
  - This is a Tier 3 decision — user chooses path.

### Step 7: Generate Financial Guardrails

If VIABLE or TIGHT, output guardrails that downstream commands reference:

\`\`\`
FINANCIAL GUARDRAILS — [Market Name]
  Maximum CPA (kill threshold): $[break-even]
  Target CPA (optimize toward): $[calculated target]
  Daily budget cap: $[user's budget]
  Maximum validation burn (Tier 1): $[7 × daily budget]
  Maximum validation burn (Tier 2): $[14 × daily budget]
  Kill timeline: If no conversions after $[3× break-even CPA] spend, kill creative.
  Scale trigger: CPA stable below $[target] for 7 consecutive days.
\`\`\`

Save guardrails to \`assets/[market-name]/research/unit-economics.md\`
Update pipeline-state.json with financial model.

## Autonomy
Tier 1 — Full Auto for calculation.
Tier 3 — Recommend & Wait if verdict is NON-VIABLE (user must decide path).

## Output
Unit Economics Report with viability verdict and financial guardrails.

## Next Step
If VIABLE/TIGHT → \`/platform\` and \`/product\` (parallel)
If NON-VIABLE → User decides: adjust pricing, adjust budget, or return to \`/scout\``;
