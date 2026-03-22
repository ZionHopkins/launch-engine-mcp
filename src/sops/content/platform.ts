export const PLATFORM = `# /platform — Platform Engine

## What This Does

60-point platform scorecard. Selects the optimal platform, medium, and format based on market data, buyer behavior, autonomy constraints, and SEO/technical infrastructure.

## Trigger Context
After Stress Test → GO. Runs parallel with Product Architecture Engine.

## Execution Protocol

1. **Run 3-5 web searches** on where the target market gathers, buys, and consumes content.

2. **Score candidate platforms** across 6 dimensions (10 pts each, 60 total):
   - **Audience Presence** (0-10) — is your buyer here?
   - **Platform Constraints** (0-10) — what can you build/sell?
   - **Competition Density** (0-10) — how crowded is it?
   - **Content Format Fit** (0-10) — does the format match your product type?
   - **Autonomy Compatibility** (0-10) — can AI build assets native to this platform?
   - **SEO/Technical Infrastructure** (0-10) — can you control the organic growth levers?
     - Custom domain support (2 pts)
     - Clean URL slugs / URL control (2 pts)
     - Schema/JSON-LD injection capability (2 pts)
     - robots.txt access / crawler control (2 pts)
     - Page speed baseline (1 pt — sub-2s load time achievable)
     - Mobile-first responsive (1 pt)

   **Hard-floor rule:** If a platform scores 0/10 on SEO/Technical Infrastructure, flag as **TECHNICAL CONSTRAINT** regardless of total score. This means organic growth is structurally blocked on this platform — the user must understand this trade-off before proceeding.

3. **Select medium type:**
   - Info product (course, ebook, membership)
   - SaaS/tool
   - App (mobile app, web app, desktop app)
   - Community + content
   - Template/framework library
   - Hybrid

4. **Document platform constraints** that downstream SOPs must respect:
   - File formats, content length limits, pricing structures, delivery mechanisms
   - **SEO constraints:** custom HTML injection capability, robots.txt upload access, URL slug control, page speed baseline, schema markup support

5. **Present recommendation** with rationale (Tier 3 if trade-offs are ambiguous).

6. Save to \`assets/[market-name]/research/platform-decision.md\`
7. Update pipeline-state.json.

## Output
Platform Decision document with constraints for downstream SOPs.

## Next Step
Feeds into \`/product\` and \`/deploy\``;
