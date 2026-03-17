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

### Production Rules
- Every claim in copy must appear in Copy Directives (authorized promises only)
- Every specific product description must come from Product Blueprint
- Language must match the Language Bank from buyer research
- Format must respect platform constraints
- All assets saved as individual files in \`assets/[market-name]/campaigns/\`

1. Invoke campaign-builder subagent with all inputs.
   - Include Name Lock Registry (\`assets/[market-name]/building-blocks/name-lock-registry.md\`)
2. Receive all campaign assets.
3. Save to \`assets/[market-name]/campaigns/\` with clear filenames.
4. Update pipeline-state.json with asset inventory.
5. Present asset list to user for review before deployment.

## Output
Complete campaign asset package. All files in assets folder.

## Next Step
Auto-trigger \`/qa\` (Persona Alignment Gate — stress-tests all assets against buyer persona before deployment)`;
