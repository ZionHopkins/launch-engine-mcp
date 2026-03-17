export const PLATFORM = `# /platform — Platform Engine

## What This Does

50-point platform scorecard. Selects the optimal platform, medium, and format based on market data, buyer behavior, and autonomy constraints.

## Trigger Context
After Stress Test → GO. Runs parallel with Product Architecture Engine.

## Execution Protocol

1. **Run 3-5 web searches** on where the target market gathers, buys, and consumes content.

2. **Score candidate platforms** across:
   - Audience presence (is your buyer here?)
   - Platform constraints (what can you build/sell?)
   - Competition density (how crowded is it?)
   - Content format fit (does the format match your product type?)
   - Autonomy compatibility (can AI build assets native to this platform?)

3. **Select medium type:**
   - Info product (course, ebook, membership)
   - SaaS/tool
   - App (mobile app, web app, desktop app)
   - Community + content
   - Template/framework library
   - Hybrid

4. **Document platform constraints** that downstream SOPs must respect (file formats, content length limits, pricing structures, delivery mechanisms).

5. **Present recommendation** with rationale (Tier 3 if trade-offs are ambiguous).

6. Save to \`assets/[market-name]/research/platform-decision.md\`
7. Update pipeline-state.json.

## Output
Platform Decision document with constraints for downstream SOPs.

## Next Step
Feeds into \`/product\` and \`/deploy\``;
