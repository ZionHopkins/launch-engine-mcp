export const PRODUCT = `# /product — Product Architecture Engine

## What This Does

Designs the actual product the buyer receives. Works backward from the buyer's identity gap to create the transformation pathway, operationalize the mechanism, and specify every deliverable.

## Trigger Context
After Stress Test → GO. Requires Building Blocks 2 (BIG IDEA), 3 (OFFER), 6 (MECHANISM), validated personas, platform decision, autonomy score, and Name Lock Registry (for mechanism and system names).

## Execution Protocol

**DELEGATE TO SUBAGENT: \`product-designer\`**

### Phase 1: Transformation Pathway Mapping
- Extract identity gap from personas (current state → desired state)
- Define 3-5 transformation milestones with blockers from persona research
- Sequence milestones by dependency

### Phase 2: Mechanism Operationalization
- Define the Unique Mechanism's operating principles (3-5 core principles)
- **Write each principle as a quotable, AI-citable definition** — format: "[Principle Name] is [clear definition in one sentence]." These become citation anchors that AI models can reference directly.
- Map each principle to a transformation milestone
- Create implementation sequence with specific actions
- Define measurable waypoints at each stage

### Phase 3: Product Architecture Design
- Convert milestones to named MODULES (outcome-oriented names, using system name from Name Lock Registry as the parent brand)
- For each module: blockers addressed, mechanism principles used, deliverables, outcomes
- Tag every deliverable: AGENT-BUILT or PERSONAL-INPUT (from autonomy score)
- Assign timeline per module

### Phase 4: Promise-Product Alignment Audit
- Extract every promise from Building Blocks and Copy Directives
- Map each promise → product component → module → deliverable
- Zero gaps required. Any gap = add component or remove promise.

### Phase 5: Tiered Build Matrix
- Tier 1 ($0 validation): What exists as promise + outline only
- Tier 2 ($100 validation): Core Module 1 + roadmap
- Tier 3 ($500+ validation): Full product
- Define what agent builds vs. what requires personal input at each tier

### Autonomy-Adaptive Behavior
- FULL AUTONOMY (30-35): Agent designs AND builds all deliverables
- HIGH AUTONOMY (22-29): Agent builds all agent-tagged items, creates briefs for personal items
- MODERATE (15-21): Agent creates architecture + templates, user creates core content
- LOW (7-14): Blueprint as production roadmap only

1. Invoke product-designer subagent with all inputs.
2. Receive complete Product Blueprint.
3. Save to \`assets/[market-name]/product/product-blueprint.md\`
4. Update pipeline-state.json.
5. Present Blueprint to user (Tier 3 for scope decisions at Tier 2/3 build).

## Output
Product Blueprint: Transformation Pathway, Mechanism Blueprint, Module Architecture, Alignment Report, Build Matrix.

## Next Step
Feeds into \`/deploy\` (Campaign Deployment)`;
