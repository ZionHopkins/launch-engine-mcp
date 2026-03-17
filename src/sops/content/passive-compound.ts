export const PASSIVE_COMPOUND = `# /passive-compound — Anchor Compounding Engine

## What This Does

Takes an ANCHOR asset and produces 3-5 related asset concepts with full build specs, scored and assigned to deployment phases. Includes cross-platform link updates and bundle opportunities.

## Trigger Context
- Auto-triggered when \`/passive-check\` classifies an asset as ANCHOR
- Manual trigger: "Compound this anchor" or \`/passive-compound [asset name]\`

## Execution Protocol

**DELEGATE TO SUBAGENT: \`passive-asset-deployer\` (compound task)**

### Step 1: Load Anchor Data

From pipeline-state.json and asset files:
- Which asset hit ANCHOR status
- Platform and asset type
- Performance metrics (revenue, conversion rate, top keywords)
- Original build spec (tags, title, therapeutic framing)
- Buyer research package (for additional pain point mining)

### Step 2: Generate Related Asset Concepts

The subagent produces 3-5 related assets using these expansion patterns:

**Same pain, different format:**
- ANCHOR is a template → companion workbook, printable journal, guided checklist
- ANCHOR is a KDP book → companion workbook, template pack (Etsy), premium toolkit (Payhip)

**Adjacent pain, same format:**
- ANCHOR serves pain point A → create same format for pain points B, C from persona research

**Bundle/premium:**
- Bundle ANCHOR with ROOT/SEED assets at premium price point
- Create "complete system" bundle across platforms (Payhip)

**Seasonal variant:**
- Holiday/event-specific version of the ANCHOR concept
- Timed to next demand window from seasonal calendar

**Cross-platform reformat:**
- ANCHOR on Etsy → reformat as KDP book
- ANCHOR on KDP → extract as Etsy template pack
- Either → premium bundle on Payhip

### Step 3: Score and Spec

Run each concept through the 40-point scorecard. Generate full build specs for DEPLOY-scoring assets (28+).

### Step 4: Update Cross-Platform Links

Map new link architecture:
- New assets link TO the ANCHOR (rides its traffic)
- ANCHOR listing updated to mention new related products
- Payhip bundle updated to include new components
- KDP backmatter updated with new Etsy listings

### Step 5: Generate Compound Deployment Checklist

\`\`\`
COMPOUND DEPLOYMENT — [Anchor Name]

ANCHOR PERFORMANCE:
  Platform: [X] | Monthly Revenue: $[X] | Conversion: [X]%

NEW ASSETS TO DEPLOY (sorted by score):

  Asset [N]: [name] | Platform: [X] | Score: [X]/40 | Price: $[X]
  Build time: [X] hours | Deploy by: [date]

  Asset [N+1]: [name] | Platform: [X] | Score: [X]/40 | Price: $[X]
  Build time: [X] hours | Deploy by: [date]

  [repeat]

LINK UPDATES:
  ☐ Update ANCHOR listing description to reference new assets
  ☐ Update KDP backmatter (if applicable)
  ☐ Update Payhip bundle to include new components
  ☐ [specific cross-platform link actions]

TOTAL BUILD TIME: ~[X] hours
EXPECTED REVENUE IMPACT: [X]% increase in niche revenue within 60 days
\`\`\`

### Step 6: Save and Update State

Save compound package to \`assets/[market-name]/passive-portfolio/compound/[anchor-name]/\`
Update pipeline-state.json with compound phase assets and deployment dates.

## Autonomy
Tier 1 — Full Auto for concept generation and scoring.
Tier 2 — Notify & Proceed for presenting compound plan.

## Output
Compound deployment package with build specs. Presented inline with checklist.

## Next Step
User builds compound assets → deploys per checklist → \`/passive-check\` at scheduled intervals.`;
