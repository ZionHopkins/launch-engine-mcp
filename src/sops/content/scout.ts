export const SCOUT = `# /scout — Scout Agentic Framework

## What This Does

Preliminary market scanning. Takes a raw idea, interest, or market signal and determines if it's worth deeper investigation. Fast, broad, signal-focused.

## Trigger Context
User has a new idea or market to explore. No pipeline exists yet.

## Execution Protocol

0. **Check learnings.** Silently read \`learnings.json\`. Filter for \`category == "market_selection"\`. If relevant patterns exist, present them as context before proceeding. If none exist, proceed without mentioning the check.

1. **Receive the seed.** The user provides a market, niche, problem, or idea. If vague, ask one clarifying question maximum before starting.

2. **Run 3-5 rapid web searches:**
   - "[market] market size revenue"
   - "[market] biggest problems pain points"
   - "[market] online courses products selling"
   - "[market] competition landscape"
   - "[market] trending growing demand"

3. **Assess against Scout Criteria:**
   - Is there a STARVING MARKET? (People already spending money to solve this problem)
   - Is the pain ACUTE? (Urgent, emotional, identity-level — not mild inconvenience)
   - Is there EXISTING DEMAND? (Products already selling = proven market, not speculative)
   - Can you reach them ONLINE? (Identifiable communities, platforms, gathering points)
   - Is this a GROWING or STABLE market? (Not declining or fad-dependent)

4. **Run preliminary Agent Autonomy assessment.** Quick gut-check on the 7 dimensions — not full scoring yet. Flag obvious LOW AUTONOMY markets immediately.

5. **Present the Scout Report:**
   - Market snapshot (size, growth, key players)
   - Pain signal strength (high/medium/low with evidence)
   - Competition density (saturated/moderate/underserved)
   - Preliminary autonomy flag (likely high/moderate/low)
   - RECOMMENDATION: Proceed to Market Intelligence OS or explore alternatives

6. **Update pipeline-state.json:**
   - Create new pipeline entry
   - Set \`current_stage: "scout"\`
   - Set \`scout.status: "complete"\`
   - Record output file location

## Output
Scout Report saved to \`assets/[market-name]/research/scout-report.md\`

## Next Step
If PROCEED → Run \`/autonomy\` for full scoring, then \`/market-intel\`
If EXPLORE ALTERNATIVES → User provides new seed, run \`/scout\` again`;
