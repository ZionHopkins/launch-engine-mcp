export const STRESS_TEST = `# /stress-test — Offer Stress Test

## What This Does

Validates the 7 Building Blocks across 5 alignment dimensions. Scores the offer's readiness to proceed to deployment.

## Trigger Context
After Building Blocks are complete. All 7 blocks must exist.

## Execution Protocol

### Score Each Dimension (1-10)

1. **Problem-Solution Alignment** — Does the BIG IDEA directly address the BIG PROBLEM? Does the UNIQUE MECHANISM solve the root cause, not just symptoms?

2. **Market-Message Alignment** — Does the language match the buyer's sophistication and awareness level? Would the target recognize themselves in this messaging?

3. **Offer-Value Alignment** — Is the perceived value genuinely 10x the price? Does every offer component address a specific pain point?

4. **Promise-Proof Alignment** — Does the PROOF substantiate the BIG PROMISE? Is the evidence type appropriate for this market's skepticism level?

5. **Mechanism-Delivery Alignment** — Can the UNIQUE MECHANISM actually be operationalized into a deliverable product? (This is where the Product Architecture Engine becomes critical.)

### Scoring
- Each dimension: 1-10
- Total: /50
- **40-50: GO** — Proceed to Layer 2
- **30-39: REVISE** — Identify weak dimensions, fix specific Building Blocks, re-test
- **Below 30: REBUILD** — Fundamental misalignment. Return to research or redefine market.

### Verdict Protocol
- **GO:** Update pipeline state, generate Copy Directives (what the marketing can promise), proceed
- **REVISE:** Name the weak dimensions, specify which Building Blocks need revision, provide specific revision instructions. User reviews and approves changes (Tier 3). Re-run stress test.
- **REBUILD:** Full stop. Present analysis of what failed. Recommend: (a) return to research with different angle, (b) pivot to adjacent market, or (c) abandon this pipeline. Tier 4 decision.

1. Score all 5 dimensions with rationale.
2. Calculate total and determine verdict.
3. Save stress test report to \`assets/[market-name]/building-blocks/stress-test-report.md\`
4. Update pipeline-state.json with verdict and score.
5. If GO: generate Copy Directives document listing every specific promise the marketing is authorized to make.

## Output
Stress Test Report with scores, verdict, and Copy Directives (if GO).

## Next Step
If GO → \`/unit-economics\` (must pass financial viability before building)
If REVISE → Fix blocks, re-run \`/stress-test\`
If REBUILD → Return to \`/research\` or \`/scout\``;
