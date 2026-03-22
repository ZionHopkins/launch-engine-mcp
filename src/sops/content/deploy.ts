export const DEPLOY = `# /deploy — Campaign Deployment Engine

## What This Does

Builds all marketing and sales assets from the validated Building Blocks, Copy Directives, Product Blueprint, and platform constraints.

## Trigger Context
After Product Architecture Engine and Platform Engine complete. Both must feed in.
Name Lock Registry must exist — no assets get built with unlocked names.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`campaign-builder\`**

### Step 0: Verify Prerequisites
Read \`pipeline-state.json\`. Verify all three conditions:
- \`name_lock.status == "locked"\`
- \`platform_engine.status == "complete"\`
- \`product_architecture.status == "complete"\`

If any are not met:
\`\`\`
STAGE_BLOCKED — Prerequisites not met.

Missing stages:
  - [stage]: status is "[current]", needs "complete"

Run these first:
  1. /name-lock (if name not locked)
  2. /platform (if platform not selected)
  3. /product (if product architecture not complete)
\`\`\`

### Step 1: Pre-Deploy Quality Gate (AUTO-EXECUTE — Tier 1)

**Before generating any campaign assets**, run the research and unit economics test modules to verify all upstream inputs are clean:

\`\`\`bash
python qa-tests/qa_runner.py [market-slug] --module research_report --module unit_economics --json-out assets/[market-name]/campaigns/qa-pre-deploy.json
\`\`\`

This catches: missing research sections, insufficient citations, cross-report contradictions (awareness/sophistication mismatch between buyer research and building blocks), broken unit economics math (margins <= 0, CAC >= LTV), and placeholder text in research files.

**If exit code is 0:** proceed to asset production.

**If exit code is 1:** fix the flagged issues in the research/unit-economics files before proceeding. These are foundational inputs — deploying from broken research produces broken copy. Fix directly (Tier 1), re-run tests, then proceed.

### Asset Production Sequence

1. **Sales Letter / Landing Page** (SOP 5: Copy Structure Formula)
   - Headline (from SOP 7 formulas, matched to awareness level)
   - Lead (hook based on direct/indirect selection from sophistication level)
   - Body: Selling points structured to overcome objections in sequence
   - Module breakdowns pulled from Product Blueprint (specific, not vague)
   - Mechanism explanation from Product Blueprint
   - Offer stack with value quantification
   - Guarantee (directly inverts buyer's biggest risk)
   - CTAs with urgency
   - FAQ addressing remaining objections from persona research

2. **Email Sequence** (5-7 emails)
   - Welcome/delivery email
   - Story-driven emails using transformation narrative
   - Objection-handling emails (one per top objection)
   - Proof/testimonial email
   - Urgency/deadline email
   - Each email references specific modules or deliverables from Product Blueprint

3. **Ad Copy** (3-5 variations)
   - Direct response ads for high-awareness markets
   - Content-style ads for low-awareness markets
   - Each variation tests a different Building Block as the lead hook
   - Platform-native formatting (respect platform constraints)

4. **Content Assets** (if platform requires content-first approach)
   - Lead magnets derived from Module 1 of Product Blueprint
   - Social proof compilations
   - Value-demonstration content pieces

5. **SEO Foundation** (applied to all landing page assets)
   - Meta title variant (<60 chars) combining primary keyword + compelling angle
   - Meta description (<160 chars) with value prop + CTA
   - Canonical URL tag (\`<link rel="canonical">\`) with clean URL slug: \`/[primary-keyword]-[mechanism-name]/\`
   - Open Graph tags (og:title, og:description, og:image, og:url, og:type)
   - Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
   - JSON-LD generation — 3 schema blocks embedded in \`<head>\`:
     - Organization schema from Name Lock Registry
     - Product schema with offer details
     - FAQ schema extracted from FAQ section
   - Review schema for testimonials section (if testimonials are present)
   - EEAT signals: author name + credentials, "Last updated" date, specific client stats
   - Citation magnets: at least 2 per landing page (named framework + specific stat)
   - Apply first-200-words rule: first 200 words of landing page must contain primary value proposition + specific stat from market intel + brand name
   - H2/H3 hierarchy that works for both conversion AND featured snippet optimization
   - FAQ section structured with question-as-header format (enables FAQ schema extraction)

### Production Rules
- Every claim in copy must appear in Copy Directives (authorized promises only)
- Every specific product description must come from Product Blueprint
- Language must match the Language Bank from buyer research
- Format must respect platform constraints
- **Landing page saved as \`.html\`** (complete HTML5 with meta tags, JSON-LD schemas, and semantic structure) — not \`.md\`
- Email sequences and ad copy saved as \`.md\` files
- All assets saved as individual files in \`assets/[market-name]/campaigns/\`

1. Invoke campaign-builder subagent with all inputs.
   - Include Name Lock Registry (\`assets/[market-name]/building-blocks/name-lock-registry.md\`)
2. Receive all campaign assets.
3. Save to \`assets/[market-name]/campaigns/\` with clear filenames.
4. Update pipeline-state.json with asset inventory.
5. Present asset list to user for review before deployment.

### Post-Deploy Structural Check (AUTO-EXECUTE — Tier 1)

After the campaign-builder subagent writes all assets, run landing page and campaign asset tests immediately — before triggering \`/qa\`:

\`\`\`bash
python qa-tests/qa_runner.py [market-slug] --module landing_page --module campaign_assets --json-out assets/[market-name]/campaigns/qa-post-deploy.json
\`\`\`

This catches: HTML validity issues, missing CTAs, no viewport meta tag, exposed API keys, placeholder text, email subject lines over 60 chars, missing ad variation components, brand name inconsistency — all structural issues that should be fixed before persona alignment even looks at the copy.

**If exit code is 0:** proceed to \`/qa\`.

**If exit code is 1:** fix the flagged structural issues directly in the campaign files (Tier 1). Re-run tests. Repeat up to 3 iterations. Then proceed to \`/qa\` — persona alignment will catch content-level issues separately.

## Output
Complete campaign asset package, structurally validated. All files in assets folder.

## Next Step
Auto-trigger \`/qa\` (Persona Alignment Gate — stress-tests all assets against buyer persona before deployment)`;
