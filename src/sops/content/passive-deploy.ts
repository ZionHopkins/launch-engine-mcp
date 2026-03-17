export const PASSIVE_DEPLOY = `# /passive-deploy — Passive Asset Deployment Agent (PADA)

## What This Does

Takes validated market intelligence from upstream and deploys platform-native passive assets across marketplace platforms. The marketplace's native metrics (views, favorites, sales velocity) serve as the automated validation layer. No ads, no sales pages, no ongoing attention required.

## Trigger Context
Trigger phrases: "Deploy passive assets" / "Run the PADA" / "Build my asset portfolio"

Requires upstream research to be complete:
- Therapeutic Buyer Research Package (validated personas + pain architecture)
- Market Intelligence OS or Scout seeds
- Competitive landscape data

## When to Use This vs. Active Pipeline

**Active Pipeline** (Building Blocks → Deploy → Traffic → Validate):
- High-ticket offers ($200+)
- Coaching, consulting, community products
- Products requiring custom sales pages and ad campaigns

**Passive Pipeline** (PADA):
- Digital downloads, templates, printables
- Low-content books, workbooks, journals
- Design assets, utility tools
- Anything sold on a marketplace without your involvement in the transaction

Both pipelines can run simultaneously from the same buyer research.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`passive-asset-deployer\`**

### Step 1: Validate Upstream Inputs

Check pipeline-state.json for:
- Therapeutic Buyer Research Package: REQUIRED (pain architecture, language bank, identity gap)
- Market Intelligence OR Scout Report: REQUIRED (scored market + seeds)
- Building Blocks: OPTIONAL (not required for passive assets — listing copy uses buyer research directly)

If buyer research is incomplete, STOP. Route to \`/research\` first.

### Step 2: Invoke Passive Asset Deployer Subagent

Pass the full research package. The subagent executes:

1. **Seed-to-Asset Translation** — converts pain points into platform-native product forms
2. **40-Point Scoring** — scores each asset on therapeutic alignment, platform fit, competitive gap, and compounding potential
3. **Phase Assignment** — sorts assets into SEED → ROOT → BRANCH → COMPOUND → SEASONAL SPRINT
4. **Build Spec Generation** — complete listing specs per asset (title, tags, description, pricing, images, therapeutic design elements)
5. **Cross-Platform Link Architecture** — maps how assets reference each other across platforms
6. **Kill/Scale Rules** — platform-calibrated validation thresholds
7. **12-Month Revenue Projection** — portfolio-level financial model
8. **Seasonal Calendar** — demand windows with deploy-by dates

### Step 3: Receive and Save Portfolio Deployment Package

Save complete package to:
\`\`\`
assets/[market-name]/passive-portfolio/
  portfolio-deployment-package.md     # Master document
  build-specs/                        # Individual asset specs
    seed-asset-1.md
    seed-asset-2.md
    seed-asset-3.md
    root-asset-4.md
    ...
  validation-thresholds.md            # All kill/scale rules by platform
  cross-platform-links.md            # Link architecture
  seasonal-calendar.md               # Demand windows + deploy-by dates
  revenue-projection.md              # 12-month model
\`\`\`

### Step 4: Generate Deployment Checklist

Like \`/validate-prep\` for the active pipeline, produce a step-by-step execution checklist:

\`\`\`
PASSIVE DEPLOYMENT CHECKLIST — SEED PHASE (Weeks 1-3)

WEEK 1:
☐ 1. Create Etsy shop (if new) — shop name, banner, about section
☐ 2. Build Asset #1: [name] using [tool] — estimated [X] hours
☐ 3. Create listing: paste title, tags, description from build spec
☐ 4. Upload product files + mockup images
☐ 5. Set price: $[exact]
☐ 6. Publish. Note listing URL: ________________

WAIT 3-4 DAYS (let algorithm index)

WEEK 1.5:
☐ 7. Build Asset #2: [name] — estimated [X] hours
☐ 8. Create listing from build spec
☐ 9. Publish. Note listing URL: ________________

WAIT 3-4 DAYS

WEEK 2.5:
☐ 10. Build Asset #3 (bundle): [name] — estimated [X] hours
☐ 11. Create listing from build spec
☐ 12. Publish. Note listing URL: ________________
☐ 13. Set calendar reminders:
      - Day 30 check: [exact date] → run /passive-check day30
      - Day 60 check: [exact date] → run /passive-check day60
      - Day 90 check: [exact date] → run /passive-check day90

TOTAL BUILD TIME: ~[X] hours over 3 weeks
TOTAL COST: ~$[listing fees only]
\`\`\`

### Step 5: Update Pipeline State

\`\`\`json
{
  "passive_portfolio": {
    "status": "seed_phase",
    "created_at": "[timestamp]",
    "niche": "[market name]",
    "total_assets_planned": [N],
    "assets_deployed": 0,
    "current_phase": "seed",
    "phases": {
      "seed": {
        "assets": ["[names]"],
        "platform": "etsy",
        "deploy_window": "weeks 1-3",
        "status": "pending"
      },
      "root": {
        "assets": ["[names]"],
        "platform": "etsy",
        "deploy_window": "weeks 4-6",
        "status": "pending",
        "gate": "Day 30 ALIVE signal required"
      },
      "branch": {
        "assets": ["[names]"],
        "platforms": ["kdp", "payhip"],
        "deploy_window": "weeks 7-10",
        "status": "pending",
        "gate": "SEED phase assets showing signal"
      },
      "compound": {
        "assets": ["[planned]"],
        "deploy_window": "weeks 11-16",
        "status": "pending",
        "gate": "Day 60 TRACTION signal required"
      },
      "seasonal": {
        "windows": [],
        "status": "pending"
      }
    },
    "portfolio_metrics": {
      "total_deployed": 0,
      "anchors": 0,
      "fillers": 0,
      "killed": 0,
      "total_revenue": 0,
      "monthly_revenue": 0
    },
    "asset_tracking": [],
    "output_files": []
  }
}
\`\`\`

### Step 6: Present to User

Present the Portfolio Deployment Package with:
- Asset portfolio sorted by score and deployment phase
- Build time estimate for SEED phase
- Revenue projection summary
- First 3 assets to build with specs

Tier 2 — Notify & Proceed for package generation.
The user builds and deploys at their own pace.

## Autonomy
Tier 1 — Full Auto for research and scoring.
Tier 2 — Notify & Proceed for presenting the deployment package.
User executes the physical build and listing at their pace.

## Output
Complete Portfolio Deployment Package in assets folder. Checklist presented inline.

## Next Step
User builds SEED assets → runs \`/passive-check day30\` at Day 30 → system routes from there.`;
