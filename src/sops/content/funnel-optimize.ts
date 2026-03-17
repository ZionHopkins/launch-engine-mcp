export const FUNNEL_OPTIMIZE = `# /funnel-optimize — Funnel Optimization Engine

## What This Does

Conversion Rate Optimization across the entire funnel: ad → click → land → read → act → convert → retain. Identifies the weakest link and generates targeted fixes.

## Trigger Context
Traffic is flowing (from /channels or /creative-test) but conversion rates are below target. Or proactive optimization during scaling.

## Execution Protocol

### Step 1: Map the Conversion Chain
Collect or estimate data for each stage:

| Stage | Metric | Benchmark | Your Data |
|-------|--------|-----------|-----------|
| Ad → Click | CTR | 1.5-2.5% (Meta), 3-5% (Search) | [user provides] |
| Click → Land | Load completion | 95%+ (under 3s) | [user provides] |
| Land → Read | Scroll depth / Time on page | 60%+ scroll to CTA, 2+ min | [user provides] |
| Read → Act | CTA click rate | 3-8% of page visitors | [user provides] |
| Act → Convert | Checkout completion | 30-60% of CTA clickers | [user provides] |
| Convert → Retain | Refund rate / M1 completion | <10% refund, >60% M1 | [user provides] |

### Step 2: Identify the Bottleneck
The weakest link relative to benchmark is the optimization target. Fixing a non-bottleneck stage wastes effort.

**Diagnosis routing:**
- Ad → Click below benchmark → Creative problem. Route to /creative-test
- Click → Land below benchmark → Technical problem. Page speed, mobile, redirects
- Land → Read below benchmark → Headline/lead mismatch. Ad promises X, page delivers Y
- Read → Act below benchmark → Offer presentation. Value unclear, risk not addressed, CTA weak
- Act → Convert below benchmark → Checkout friction. Too many steps, trust signals missing, payment issues
- Convert → Retain below benchmark → Product problem. Route to Execution OS /feedback for Product Architecture fix

### Step 3: Generate Hypothesis
For the identified bottleneck, generate a specific, testable hypothesis:
- "Scroll depth is low because the headline references [problem] but the ad referenced [mechanism]"
- "CTA clicks are low because the guarantee is buried below the fold"
- "Checkout abandonment is high because there's no order summary before payment"

The hypothesis MUST reference specific elements from the buyer research, Building Blocks, or product architecture. Never generic.

### Step 4: Generate One Variation — IMPLEMENTATION-READY
Create exactly ONE change that tests the hypothesis. Output the actual replacement content, not a description of what to change:

**If headline problem:**
\`\`\`
CURRENT HEADLINE: "[paste current from landing page file]"

TEST VARIATION A: "[new headline — outcome-first angle]"
TEST VARIATION B: "[new headline — mechanism-first angle]"
TEST VARIATION C: "[new headline — pain-first angle]"

IMPLEMENT: Replace headline text on landing page. Keep everything else identical.
SPLIT: 50/50 traffic between current and best-performing variation.
\`\`\`

**If CTA problem:**
\`\`\`
CURRENT CTA: "[paste current button text + surrounding copy]"

TEST VARIATION:
  Button text: "[new text]"
  Supporting line above button: "[new urgency/clarity line]"
  Placement change: [move above fold / add second CTA at mid-page / etc.]

IMPLEMENT: [exact location on page to change]
\`\`\`

**If email subject line problem:**
\`\`\`
CURRENT SUBJECT: "[paste current]"
  Open rate: [X]%

TEST SUBJECTS (send to equal splits):
  A: "[new subject — curiosity angle]"
  B: "[new subject — benefit angle]"
  C: "[new subject — urgency angle]"

IMPLEMENT: Split list into 4 equal segments. Send A/B/C to 3 segments, current to 1.
\`\`\`

**If checkout problem:**
\`\`\`
CURRENT FLOW: [describe current steps]
FRICTION POINT: [specific step where drop-off occurs]

TEST VARIATION:
  Remove: [specific field or step]
  Add: [trust signal, summary, or simplification]
  Result: [X] steps reduced to [Y] steps

IMPLEMENT: [exact page/form changes needed]
\`\`\`

**Rule: One variable at a time.** Complete redesigns make it impossible to learn what worked. The variation must be implementable in under 10 minutes.

### Step 5: Define Test Parameters
- Traffic split: 50/50 between control and variation
- Minimum sample: 100 conversions per variation for statistical significance (adjust if low-traffic)
- Duration: minimum 7 days to account for day-of-week variance
- Success metric: primary KPI for the bottleneck stage
- Decision threshold: 95% statistical confidence before declaring winner

### Step 6: Document and Iterate
- Winner replaces control
- Loser is discarded with documented learning
- Re-measure the full conversion chain
- Identify NEW bottleneck (fixing one often reveals the next)
- Cycle repeats

Save optimization report to \`assets/[market-name]/traffic/funnel-optimization/test-[N].md\`
Update pipeline-state.json with optimization history.

## Integration with Execution OS
- If diagnosis points to OFFER problem (Read → Act) → Alert Execution OS. May need Building Block revision via /feedback
- If diagnosis points to PRODUCT problem (Convert → Retain) → Route to Execution OS /feedback for Product Architecture iteration
- If diagnosis points to COPY problem (Land → Read) → Generate new copy variation AND notify Execution OS to update source assets
- If diagnosis is purely traffic-side → Handle internally

## Autonomy
Tier 1 — Full Auto for diagnosis and variation generation.
Tier 2 — Notify & Proceed for implementing variations on test pages.
Tier 3 — Recommend & Wait if the diagnosis suggests a Building Block or Product issue (requires Execution OS coordination).

## Next Step
After optimization stabilizes → \`/scale\`
If fundamental offer issues → Execution OS \`/feedback\``;
