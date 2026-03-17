export const RESEARCH = `# /research — Therapeutic Buyer Engine

## What This Does

Deep buyer persona research. Builds therapeutic-level understanding of the target buyer's pain architecture, failed solutions, identity gap, and transformation narrative.

## Trigger Context
After Market Intelligence OS completes. Market is scored and seed is selected.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`buyer-researcher\`**

The subagent executes 25-35 web searches across:
- Forums, Reddit, Quora where targets discuss their pain
- Amazon reviews of competing products (failed solutions)
- Social media groups where targets gather
- Competitor content and positioning
- Medical/scientific research backing the problem space

The subagent builds and returns:
- **Pain Architecture:** Top 5-7 pain points ranked by emotional intensity
- **Failed Solutions Map:** What they've tried, why it failed, what beliefs those failures created
- **Identity Gap:** Who they are now vs. who they want to become (specific, not generic)
- **Language Bank:** Exact phrases, words, and emotional expressions the target uses
- **Sophistication Level (1-5):** How aware is this market of existing solutions?
- **Awareness Level (1-5):** How aware are they of their specific problem?
- **Transformation Narrative:** The story arc from current state to desired state
- **Customer Avatar Sheet:** Demographics, psychographics, information sources, objections

1. Invoke buyer-researcher subagent with market seed + market intelligence data.
2. Receive the finished Therapeutic Buyer Research Package.
3. Save to \`assets/[market-name]/research/buyer-research-package.md\`
4. Update pipeline-state.json.
5. Present key persona findings to user.

**SECOND AUTONOMY CHECK:** After persona research reveals what the buyer actually needs, re-evaluate the Agent Autonomy Score. The transformation requirements may have changed the score. If score dropped to LOW, flag immediately.

## Output
Therapeutic Buyer Research Package. Persona files in assets folder.

## Next Step
\`/build-blocks\` (SOP 1: Promotion Invention)`;
