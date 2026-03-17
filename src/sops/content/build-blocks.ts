export const BUILD_BLOCKS = `# /build-blocks — SOP 1: 3-Part Promotion Invention Process

## What This Does

Assembles the 7 Building Blocks from Tej Dosa's framework using the buyer research and market intelligence data. These blocks are the foundation of every marketing asset.

## Trigger Context
After Therapeutic Buyer Engine completes. Full persona and market data available.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`offer-architect\`**

The subagent receives the full research package and builds:

### The 7 Building Blocks

1. **BIG PROBLEM** — The massive, urgent, emotional problem your target faces. Must be stated in THEIR language (from the Language Bank). Not your clinical description — their visceral experience.

2. **BIG IDEA** — The one compelling idea that makes everything click. The conceptual breakthrough that makes the target say "THAT'S what I've been missing." Must pass the "tell a friend" test — can they explain it in one sentence?

3. **IRRESISTIBLE OFFER** — The complete package: core product, bonuses, guarantee, urgency, price. Structured so the perceived value is 10x the price. Every component addresses a specific pain point or failed solution from research.

4. **USP (Unique Selling Proposition)** — What makes this fundamentally different from everything else in the market. Not "better" — DIFFERENT. Must address the #1 reason previous solutions failed.

5. **BIG PROMISE** — The specific transformation outcome. Concrete, measurable, time-bound where possible. Must bridge the identity gap from persona research.

6. **UNIQUE MECHANISM** — The named system, method, protocol, or framework that makes the transformation possible. This is WHY your solution works when others didn't. Must be operationalizable (Product Architecture Engine will validate this).

7. **PROOF** — Evidence that the mechanism works. Case studies, data, testimonials, logical demonstration, scientific backing. Addresses the buyer's specific skepticism (from failed solutions map).

### Assembly Rules
- Every block must reference specific findings from the buyer research
- BIG IDEA must be novel enough that the market hasn't heard it before
- UNIQUE MECHANISM must be nameable and explainable in 2 sentences
- OFFER must include a guarantee that directly inverts the buyer's biggest risk
- PROOF must counter the specific objections identified in research

1. Invoke offer-architect subagent with full research package.
2. Receive completed 7 Building Blocks.
3. Save to \`assets/[market-name]/building-blocks/building-blocks.md\`
4. Update pipeline-state.json.
5. Present Building Blocks to user for review (Tier 3 — some blocks need user input on positioning decisions).

## Output
7 Building Blocks document. Saved in assets folder.

## Next Step
\`/stress-test\` (Offer Stress Test)`;
