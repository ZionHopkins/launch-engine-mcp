export const TRAFFIC_ANALYTICS = `# /traffic-analytics — Traffic Analytics & Attribution

## What This Does

Performance analysis, attribution, and feedback routing. Translates raw campaign data into actionable intelligence and feeds it back to the Execution OS Optimizer.

## Trigger Context
Anytime the user has performance data to analyze. Can run daily, weekly, or on-demand.

## Execution Protocol

### Step 1: Collect Data
Provide the user with this PASTE-IN TEMPLATE. They fill in the numbers, paste it back, and the agent processes it:

\`\`\`
TRAFFIC DATA — [date range]

SPEND & REVENUE:
  Total Ad Spend: $
  Total Revenue: $
  Number of Sales:

CHANNEL: [Meta / Google / YouTube / Email / Other]
  Impressions:
  Clicks:
  CTR: %
  CPC: $
  Conversions:
  CPA: $
  ROAS: x

LANDING PAGE:
  Page Views:
  Avg Time on Page: min sec
  Scroll to CTA: %
  CTA Clicks:
  Bounce Rate: %

EMAIL (if running):
  Emails Sent:
  Open Rate: %
  Click Rate: %
  Unsubscribe Rate: %

PRODUCT:
  Refund Requests:
  Module 1 Completion: %
  Support Tickets:

CREATIVE PERFORMANCE (per ad):
  Ad [name/ID]: Spend $__ | Impressions __ | CTR __% | CPA $__ | Conv __
  Ad [name/ID]: Spend $__ | Impressions __ | CTR __% | CPA $__ | Conv __
  Ad [name/ID]: Spend $__ | Impressions __ | CTR __% | CPA $__ | Conv __
\`\`\`

If the user pastes partial data, work with what's available. Flag which metrics are missing and what they'd unlock if provided.

Accept data in any format — the template above is ideal but Claude should parse dashboards, screenshots described in text, or conversational summaries equally.

### Step 2: Organize into Metrics Hierarchy

**Tier 1 — Revenue Metrics (the only ones that matter long-term):**
- Total Revenue generated
- ROAS (Return on Ad Spend) = Revenue / Ad Spend
- Profit = Revenue - (Ad Spend + COGS + Overhead)
- LTV estimate (if repeat purchase data exists)

**Tier 2 — Conversion Metrics (efficiency of converting traffic):**
- CPA (Cost Per Acquisition) = Ad Spend / Conversions
- Conversion Rate = Conversions / Clicks
- Cost Per Lead = Ad Spend / Leads
- Email Conversion Rate = Sales / Email Subscribers

**Tier 3 — Engagement Metrics (leading indicators):**
- CTR (Click-Through Rate) = Clicks / Impressions
- Landing Page Scroll Depth and Time on Page
- Email Open Rate and Click Rate
- Video View Rate and Hook Rate

**Tier 4 — Reach Metrics (vanity unless contextualized):**
- Impressions, CPM, Frequency, Reach
- Only useful for diagnosing delivery issues

### Step 3: Benchmark Comparison
Compare each metric against:
- Industry benchmarks (from traffic strategy research)
- Historical performance (from previous analytics reports)
- Target KPIs (from traffic strategy document)

Flag any metric that is:
- 20%+ below target → PROBLEM (needs immediate attention)
- Within 20% of target → MONITORING (watch but don't react yet)
- At or above target → HEALTHY (maintain or scale)

### Step 4: Diagnose and Route

**Traffic-side issues (Traffic Agent handles internally):**
- Low CTR → Creative problem → /creative-test
- High CPM → Audience saturation → /scale (horizontal)
- High frequency → Audience exhaustion → New audiences needed
- Low video view rate → Hook problem → New creative hooks

**Funnel-side issues (Traffic Agent + Execution OS):**
- High bounce rate → Ad-page mismatch → /funnel-optimize
- Low scroll depth → Headline/lead problem → /funnel-optimize
- Low CTA clicks → Offer presentation → /funnel-optimize + possibly /feedback

**Offer-side issues (Route to Execution OS):**
- High traffic + good engagement + no conversions → Offer problem → Execution OS /feedback
- Conversions but high refunds → Product problem → Execution OS /feedback (Product Architecture)
- Conversions but no repeat/referral → LTV problem → Product or retention issue

**Scaling signals (Route to /scale):**
- All metrics healthy + budget headroom → Ready to scale
- Primary channel plateauing + secondary channel showing promise → Channel rebalance

### Step 5: Generate Analytics Report

Report format:
\`\`\`
TRAFFIC ANALYTICS — [Market Name] — [Date Range]

REVENUE SNAPSHOT:
Total Spend: $___  |  Revenue: $___  |  ROAS: ___x  |  Profit: $___

CHANNEL PERFORMANCE:
[Channel 1]: CPA $__ | CTR __% | Conv Rate __% | Status: [HEALTHY/MONITOR/PROBLEM]
[Channel 2]: CPA $__ | CTR __% | Conv Rate __% | Status: [HEALTHY/MONITOR/PROBLEM]

CONVERSION CHAIN:
Ad→Click: __% [✅/⚠️/🔴]
Click→Land: __% [✅/⚠️/🔴]
Land→Read: __% [✅/⚠️/🔴]
Read→Act: __% [✅/⚠️/🔴]
Act→Convert: __% [✅/⚠️/🔴]
Convert→Retain: __% [✅/⚠️/🔴]

BOTTLENECK: [Identified weakest link]
DIAGNOSIS: [Specific hypothesis]
RECOMMENDED ACTION: [Which command to run + specific instructions]

CREATIVE PERFORMANCE:
[Ranked list of active creatives by primary KPI]
Winners: [...]  |  Fatiguing: [...]  |  Kill: [...]

SCALING STATUS:
Readiness: [Met/Not met — which criteria missing]
Recommendation: [Hold / Vertical scale / Horizontal scale / Channel scale]
\`\`\`

### Step 6: Save and Update State
- Save report to \`assets/[market-name]/traffic/analytics/report-[date].md\`
- Update pipeline-state.json traffic_performance object
- If routing to Execution OS: flag the issue in pipeline state for /feedback to consume

## Autonomy
Tier 1 — Full Auto for data analysis and report generation.
Tier 2 — Notify & Proceed for routing recommendations.

## Next Step
Based on diagnosis: /creative-test, /funnel-optimize, /scale, or Execution OS /feedback`;
