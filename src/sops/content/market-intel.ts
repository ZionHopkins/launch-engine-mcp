export const MARKET_INTEL = `# /market-intel — Market Intelligence OS

## What This Does

Deep market scoring system. 120-point scorecard across multiple dimensions. Identifies the #1 market seed for pipeline progression.

## Trigger Context
After Scout + Autonomy Score. Market has passed preliminary screening.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`market-researcher\`**

This SOP runs as a subagent (defined in \`.claude/agents/market-researcher.md\`).
The subagent executes 15-20 web searches, scores the market, and returns:
- Full 120-point scorecard
- Top 3 scored markets (if multiple were evaluated)
- #1 seed recommendation with rationale
- Key data points that feed into Therapeutic Buyer Engine

1. Invoke the market-researcher subagent with the market name and scout report data.
2. Receive the finished Market Intelligence Report.
3. Save to \`assets/[market-name]/research/market-intelligence-report.md\`
4. Update pipeline-state.json:
   - Set \`market_intelligence.status: "complete"\`
   - Record the score
   - Set \`current_stage: "therapeutic_buyer"\`
5. Present the top-line findings to the user.

## Autonomy Tier
Tier 2 — Notify & Proceed. Run the subagent, present results.

## Output
Market Intelligence Report saved to assets folder. Score stored in pipeline state.

## Next Step
\`/research\` (Therapeutic Buyer Engine)`;
