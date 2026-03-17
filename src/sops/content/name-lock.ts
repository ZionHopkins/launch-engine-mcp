export const NAME_LOCK = `# /name-lock — Name Lock Gate

## What This Does

Consolidates every naming decision into a single locked document BEFORE any asset creation begins. The Name Lock Registry becomes a hard dependency for /deploy, /product, and /passive-deploy. No customer-facing asset gets built until names are locked.

## The Problem This Solves
Names get created implicitly during /build-blocks (Unique Mechanism name) and /product (module names). If a name turns out to be unavailable (domain, trademark, marketplace conflict) or the user changes their mind, every downstream asset needs a find-and-replace pass. That's a sequencing failure — the decision was made at a point where changing it was cheap, but nobody locked it before the point where changing it became expensive.

## Trigger Context
After Stress Test → GO and Unit Economics → VIABLE, before /platform, /product, or /deploy.

Auto-triggered: When pipeline-state shows stress_test.verdict = "GO" and unit_economics.verdict = "viable", this gate activates before Layer 2 execution.

Manual: User types \`/name-lock\` to run or revise naming decisions.

## Prerequisites
- Building Blocks complete (Block 2: BIG IDEA, Block 6: UNIQUE MECHANISM already have working names)
- Stress Test → GO (names are worth locking)
- Unit Economics → VIABLE (market is worth naming for)

## Execution Protocol

### Step 1: Extract Candidate Names from Building Blocks

Pull every name that will appear in customer-facing assets:
- **Product/Brand Name**: The customer-facing name for the offer (may not exist yet — that's the point of this gate)
- **Mechanism Name**: From Building Block 6 (UNIQUE MECHANISM). Already named during /build-blocks.
- **Program/System Name**: If the mechanism has a named system, method, or protocol
- **Tagline/Descriptor**: One-line positioning statement (optional but useful)

Present what exists and what's missing:
\`\`\`
NAME LOCK — [Market Name]

EXISTING NAMES (from Building Blocks):
  Mechanism: [name from Block 6]
  System/Method: [if named]

NAMES NEEDED:
  Product/Brand Name: [NOT YET ASSIGNED]
  Tagline: [NOT YET ASSIGNED]
\`\`\`

### Step 2: Generate Name Candidates

For each name slot that needs filling, generate 3-5 candidates scored against:

1. **Memorability** (1-5): Can someone repeat it after hearing it once?
2. **Mechanism Clarity** (1-5): Does the name hint at HOW it works or WHAT it does?
3. **Market Resonance** (1-5): Does it use language/concepts from the buyer's world? (Check Language Bank)
4. **Distinctiveness** (1-5): Does it sound different from competitors identified in market intel?
5. **Domain/Handle Availability** (check): Quick web search for [name].com and obvious social handles

Present as a scored table. Recommend the top candidate with rationale.

**CRITICAL RULE: One round of options. If the user rejects all candidates, generate ONE more round max with specific feedback incorporated. After that, the user provides their own name or picks from what exists. No infinite naming loops.**

### Step 3: Lock Decision

Once the user confirms names (Tier 3 — Recommend & Wait):

Generate the **Name Lock Registry**:
\`\`\`
NAME LOCK REGISTRY — [Market Name]
Locked: [timestamp]

PRODUCT NAME: [confirmed name]
MECHANISM NAME: [confirmed name]
SYSTEM/METHOD NAME: [confirmed name, if applicable]
TAGLINE: [confirmed tagline, if applicable]

USAGE RULES:
- Product name appears in: headlines, CTAs, email subject lines, ad copy, landing page title
- Mechanism name appears in: body copy, mechanism explanation sections, module descriptions
- System name appears in: product architecture, module names, onboarding copy
- Tagline appears in: subheadlines, social bios, ad copy (optional)

DOMAIN: [confirmed domain, if applicable]
SOCIAL HANDLES: [confirmed handles, if applicable]

STATUS: LOCKED
Any name change after this point requires re-running /name-lock and regenerating affected assets.
\`\`\`

### Step 4: Update Building Blocks Reference

If any name changed from the original Building Blocks version:
- Update the Building Blocks document with locked names
- Update Copy Directives to reference locked names
- Note: this is a name-swap only, not a content revision. No need to re-run /stress-test.

### Step 5: Save and Update Pipeline State

Save registry to: \`assets/[market-name]/building-blocks/name-lock-registry.md\`

Update pipeline-state.json:
\`\`\`json
{
  "name_lock": {
    "status": "locked",
    "locked_at": "[timestamp]",
    "product_name": "[name]",
    "mechanism_name": "[name]",
    "system_name": "[name or null]",
    "tagline": "[tagline or null]",
    "domain": "[domain or null]",
    "revision_count": 0,
    "output_file": "assets/[market-name]/building-blocks/name-lock-registry.md"
  }
}
\`\`\`

### Step 6: Present Confirmation

\`\`\`
NAME LOCK COMPLETE — [Market Name]

Product: [name]
Mechanism: [name]
System: [name]
Domain: [domain status]

These names are now locked. All downstream assets (/product, /deploy, /passive-deploy)
will reference the Name Lock Registry. Any name change after this point requires
re-running /name-lock.

Ready for: /platform, /product, /deploy
\`\`\`

## Post-Lock Name Changes

If the user wants to change a name after lock:
1. Re-run \`/name-lock\` with the change
2. If assets have already been built: flag which assets need regeneration
3. Update pipeline-state.json with \`revision_count\` incremented
4. Note: this is deliberately friction-ful. The friction is the feature — it prevents casual name changes from cascading into rework.

## Autonomy
Tier 1 — Full Auto for extracting existing names and generating candidates.
Tier 3 — Recommend & Wait for final name selection (user must confirm).

## Output
Name Lock Registry (.md) saved to building-blocks directory. Pipeline state updated.

## Next Step
\`/platform\` and \`/product\` (both can now reference locked names)
Then → \`/deploy\` (campaign-builder uses registry as naming input)`;
