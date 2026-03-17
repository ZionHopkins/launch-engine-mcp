export const PASSIVE_PORTFOLIO = `# /passive-portfolio — Portfolio Feedback Report

## What This Does

Generates a comprehensive portfolio-level feedback report across all platforms. Identifies anchors, fillers, and dead weight. Surfaces patterns. Produces next-quarter deployment priorities.

## Trigger Context
- Quarterly: every 90 days after first deployment
- Manual: "Portfolio check" or \`/passive-portfolio\`
- Auto-suggested by \`/status\` when 90 days since last portfolio review

## Execution Protocol

### Step 1: Collect Portfolio-Wide Metrics

Present the user with a portfolio data template:

\`\`\`
PORTFOLIO DATA — Quarter [X] — [Date Range]

ETSY:
  Total listings:
  Total views (this quarter):
  Total sales (this quarter):
  Total revenue: $
  Top 3 assets by revenue:
    1. [name]: $[revenue] | [views] views | [conversion]% conv
    2. [name]: $[revenue] | [views] views | [conversion]% conv
    3. [name]: $[revenue] | [views] views | [conversion]% conv
  Worst 3 assets:
    1. [name]: $[revenue] | [views] views
    2. [name]: $[revenue] | [views] views
    3. [name]: $[revenue] | [views] views

KDP:
  Total titles:
  Total sales:
  Total KENP reads:
  Total revenue: $
  Top title: [name] — $[revenue]
  Worst title: [name] — $[revenue]

PAYHIP:
  Products listed:
  Total visitors:
  Total sales:
  Revenue: $
  Avg conversion rate: %

STAN STORE (if active):
  Revenue: $
  Sales:

WHOP (if active):
  Revenue: $
  Sales:

TOTAL PORTFOLIO REVENUE THIS QUARTER: $
\`\`\`

Accept data in any format.

### Step 2: Generate Portfolio Feedback Report

\`\`\`
PORTFOLIO FEEDBACK REPORT — QUARTER [X]

═══════════════════════════════════════════════════════

DEPLOYMENT SUMMARY:
  Assets deployed this quarter: [#]
  Assets killed this quarter: [#] ([%] kill rate)
  Assets at ANCHOR status: [#]
  Assets at FILLER status: [#]
  Assets at DEAD WEIGHT: [#]
  Total active portfolio: [#]
  Survival rate (all-time): [%]

REVENUE:
  Quarter revenue: $[X]
  Monthly average: $[X]
  Month-over-month trend: [↑/↓/→] [%]
  Revenue per active asset: $[X]/mo average
  Top 3 assets: [names] = [%] of total revenue
  Revenue concentration risk: [healthy (<40%) / concentrated (>40%) / dangerous (>60%)]

NICHE PERFORMANCE:
| Niche | Assets | Survival Rate | Revenue | Revenue/Asset | Trend |
|-------|--------|--------------|---------|---------------|-------|
| [Niche 1] | [#] | [%] | $[X] | $[X] | [↑/↓/→] |
| [Niche 2] | [#] | [%] | $[X] | $[X] | [↑/↓/→] |

PLATFORM PERFORMANCE:
| Platform | Assets | Revenue | Rev/Asset | Kill Rate | Best Type |
|----------|--------|---------|-----------|-----------|-----------|
| Etsy | [#] | $[X] | $[X] | [%] | [format] |
| KDP | [#] | $[X] | $[X] | [%] | [format] |
| Payhip | [#] | $[X] | $[X] | [%] | [format] |

CROSS-PLATFORM LINK PERFORMANCE:
| Link Type | Est. Clicks | Conversions | Notes |
|-----------|------------|-------------|-------|
| Etsy → KDP | [if trackable] | [#] | [X] |
| KDP → Payhip | [if trackable] | [#] | [X] |

SEASONAL PERFORMANCE:
| Window | Assets | Revenue | vs. Baseline |
|--------|--------|---------|-------------|
| [window] | [#] | $[X] | [X]x |

═══════════════════════════════════════════════════════

PATTERN INTELLIGENCE:

What's working:
  - [Niche/format/price/platform combinations that survive and earn]

What's failing:
  - [Patterns in killed assets — format? platform? price? targeting?]

Surprise signals:
  - [Unexpected winners or niches showing potential]

Therapeutic buyer confirmation:
  - [Evidence that therapeutic targeting outperforms generic]

═══════════════════════════════════════════════════════

ACTIONS — NEXT QUARTER:

KILL LIST (execute immediately):
  ☐ [Asset name] — Platform: [X] — Reason: [dead weight criteria]
  ☐ [Asset name] — Platform: [X] — Reason: [dead weight criteria]

COMPOUND LIST (deploy related assets):
  ☐ [Anchor name] — Deploy [X] related assets (run /passive-compound)

OPTIMIZE LIST (one change per asset):
  ☐ [Asset name] — Change: [specific optimization]

SEASONAL PREP (deploy-by dates):
  ☐ [Seasonal asset] — Deploy by: [date] for [demand window]

NEW NICHE EVALUATION:
  ☐ [Should you open a second niche? Based on portfolio saturation data]

═══════════════════════════════════════════════════════

12-MONTH TRAJECTORY (updated with real data):

| Month | Projected Active | Projected Monthly Revenue | Actual (if data) |
|-------|-----------------|--------------------------|-----------------|
| [current] | [X] | $[X] | $[actual] |
| [+3] | [X] | $[X] | — |
| [+6] | [X] | $[X] | — |
| [+12] | [X] | $[X] | — |

═══════════════════════════════════════════════════════
\`\`\`

### Step 3: Auto-Capture Learnings

Extract portfolio-level patterns for \`/lessons\`:
- Platform-specific success patterns (which formats win where)
- Price point patterns (which ranges convert best per platform)
- Therapeutic force correlation (do assets targeting stronger therapeutic forces survive more?)
- Seasonal multiplier data (how much do seasonal windows amplify revenue?)
- Kill pattern data (most common reason for asset death)
- Compounding evidence (does catalog depth actually improve per-listing performance?)

### Step 4: Save Report

Save to \`assets/[market-name]/passive-portfolio/quarterly-reviews/Q[X]-review.md\`
Update pipeline-state.json passive_portfolio metrics.

## Integration with Active Pipeline

If the portfolio review reveals:
- An ANCHOR niche with strong therapeutic buyer signals → Consider running the active pipeline for a high-ticket offer in the same niche
- Cross-platform traffic data showing high engagement → Route to \`/traffic-strategy\` for paid amplification of top assets
- A niche with zero traction across all formats → \`/lessons\` capture, then evaluate with \`/scout\` for adjacent markets

## Autonomy
Tier 1 — Full Auto for report generation.
Tier 2 — Notify & Proceed for kill/compound/optimize recommendations.

## Output
Portfolio Feedback Report saved to assets folder. Action list presented inline.

## Next Step
Execute kill list → run \`/passive-compound\` on anchors → build seasonal assets → repeat next quarter.`;
