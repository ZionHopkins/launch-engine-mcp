export const AUTONOMY = `# /autonomy — Agent Autonomy Score

## What This Does

Evaluates 7 dimensions of agent buildability. Determines if the product required to fulfill the market's transformation can be created autonomously.

## Trigger Context
After Scout identifies a market worth exploring. Runs BEFORE deep research investment.

## Execution Protocol

1. **Score each dimension 1-5:**

   | Dimension | 1 (You Required) | 5 (Full Agent) |
   |-----------|------------------|----------------|
   | Knowledge Source | Your unique lived experience | Synthesizable from public research |
   | Demonstration Requirement | Must see you demo on camera | Written systems/templates suffice |
   | Credential Dependency | Licensed professional required | System logic establishes authority |
   | Deliverable Format | Live video/coaching required | PDFs, tools, templates, automations |
   | Interaction Model | 1-on-1 human interaction essential | Fully self-serve, async |
   | Transformation Type | Physical skill requiring human feedback | Knowledge/system → apply independently |
   | Update Velocity | Stable, rarely changes | Fast-moving, AI rebuilds faster |

2. **Calculate total and classify:**
   - 30-35: FULL AUTONOMY → Green light, maximum leverage
   - 22-29: HIGH AUTONOMY → Green light, light oversight needed
   - 15-21: MODERATE AUTONOMY → Proceed with flag, document personal input needs
   - 7-14: LOW AUTONOMY → Hard stop. Recommend alternatives.

3. **Present the score card** with dimension-level rationale.

4. **Gate decision:**
   - FULL/HIGH → Proceed to Market Intelligence OS
   - MODERATE → Proceed but flag which components need personal input
   - LOW → Present score, recommend exploring adjacent high-autonomy markets. Only proceed on explicit user override (Tier 4 decision).

5. **Update pipeline-state.json** with full autonomy score object.

## Output
Autonomy scorecard presented inline. Score stored in pipeline state.

## Next Step
If GREEN → \`/market-intel\`
If LOW + override → \`/market-intel\` with autonomy constraints documented`;
