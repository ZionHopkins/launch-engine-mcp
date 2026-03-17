export const PASSIVE_CHECK = `# /passive-check — Passive Asset Validation Check

## What This Does

Platform-calibrated validation checks for passive marketplace assets. Runs at scheduled intervals, applies pre-programmed kill/scale rules, and produces immediate action decisions per asset.

## Trigger Context
Scheduled check dates from \`/passive-deploy\` deployment checklist. User types:
- \`/passive-check day14\` — Whop rapid signal check only
- \`/passive-check day30\` — Etsy + KDP early signal check
- \`/passive-check day45\` — Whop traction + Etsy optimization follow-up
- \`/passive-check day60\` — Etsy + KDP traction check (major decision point)
- \`/passive-check day90\` — Full classification across all platforms

## Execution Protocol

### Step 1: Accept Platform Metrics

Provide the user with a platform-specific paste template:

**Etsy Check Template:**
\`\`\`
ETSY — [Asset Name] — Day [30/60/90]
Views:
Favorites:
Sales:
Revenue: $
Conversion rate: %
Search impressions (if visible):
Reviews:
\`\`\`

**KDP Check Template:**
\`\`\`
KDP — [Asset Name] — Day [30/60/90]
KENP pages read:
Sales (copies):
Revenue: $
BSR (current):
Reviews:
BSR trend: [improving / stable / worsening]
\`\`\`

**Whop Check Template:**
\`\`\`
WHOP — [Asset Name] — Day [14/45/90]
Page views:
Purchases:
Revenue: $
Affiliate referrals:
\`\`\`

**Payhip / Stan Store Check Template:**
\`\`\`
PAYHIP/STAN — [Asset Name]
Unique visitors:
Purchases:
Revenue: $
Conversion rate: %
Traffic source: [KDP backlink / Etsy description / Social / Other]
\`\`\`

Accept data in any format. Parse whatever comes in.

### Step 2: Apply Platform-Specific Validation Rules

#### ETSY DAY 30 (Signal Check)

| Signal | Verdict | Action |
|--------|---------|--------|
| Views ≥75 + Favorites ≥5 | 🟢 **ALIVE** | HOLD. Continue to Day 60. No changes needed. |
| Views ≥75, Favorites <5 | 🟡 **OPTIMIZE** | Improve main image + first 3 words of title. ONE change only. Re-check Day 45. |
| Views 25-74, any favorites | 🟡 **OPTIMIZE** | Rework tags and title. Give reworked version 14 more days. |
| Views <25 + 0 favorites | 🔴 **OPTIMIZE (last chance)** | Rework tags, title, and category. If still silent at Day 45, KILL. |
| Views <10 | ❌ **KILL** | Listing is invisible. Redeploy concept with fundamentally different keywords. |

#### ETSY DAY 60 (Traction Check — Major Decision Point)

| Signal | Verdict | Action |
|--------|---------|--------|
| Sales ≥3 + Conversion ≥1.5% | 🟢 **TRACTION** | SCALE. Trigger ROOT/COMPOUND phase. Deploy 2-3 related listings + bundle. |
| High views, conversion <0.5% | 🟡 **OPTIMIZE** | Fix price, description, or mockup images. ONE change. Re-evaluate Day 75. |
| 0 sales after 100+ views | ❌ **KILL** | Market verdict: product doesn't match demand. Salvage research into different format. |
| Low views persisting from Day 30 | ❌ **KILL** | Niche has no Etsy search volume. Try KDP or Payhip instead. |

#### ETSY DAY 90 (Classification)

| Criteria | Classification | Action |
|----------|---------------|--------|
| Revenue ≥$100/mo + Conversion ≥2% + Reviews ≥3 | ⭐ **ANCHOR** | COMPOUND: Deploy 3-5 related assets. Consider Etsy promoted listings ($1-5/day). |
| Revenue $25-100/mo, stable | 📦 **FILLER** | MAINTAIN: Keep live. Contributes to catalog authority. No additional investment. |
| Revenue <$25/mo after 90 days | 💀 **DEAD WEIGHT** | EXTRACT or KILL: Repackage for KDP/Payhip, or delist. |

#### KDP DAY 30 (Early Signal — HOLD BIAS)

| Signal | Verdict | Action |
|--------|---------|--------|
| KENP ≥200 OR Sales ≥2 | 🟢 **ALIVE** | HOLD. Continue to Day 60. KDP is working slowly. |
| Zero reads + 1-2 sales | 🟡 **HOLD** | Some signal. Continue to Day 60. |
| Zero everything | 🟡 **HOLD + OPTIMIZE** | Rework 7 keyword boxes + categories. Check cover thumbnail. Do NOT kill. |

**⚠️ NEVER kill a KDP book at Day 30.** Platform indexes too slowly for a reliable verdict.

#### KDP DAY 60 (Traction Check)

| Signal | Verdict | Action |
|--------|---------|--------|
| Sales ≥8 + KENP ≥1000 + Reviews ≥1 | 🟢 **TRACTION** | SCALE. Deploy companion titles. Cross-reference Etsy shop in backmatter. |
| Reads but low sales | 🟡 **OPTIMIZE** | Adjust pricing. Try $0.99 Countdown Deal to spike BSR. |
| <3 sales + <200 reads | 🟡 **OPTIMIZE** | Rework cover, title, subtitle. Give 30 more days. |
| Zero reads + zero sales (despite Day 30 optimization) | ❌ **KILL** | Niche has no KDP demand. Salvage content as Etsy template or Payhip toolkit. |

#### KDP DAY 90 (Classification)

| Criteria | Classification | Action |
|----------|---------------|--------|
| Revenue ≥$150/mo + Sales velocity stable + Reviews ≥3 + BSR <200K | ⭐ **ANCHOR** | COMPOUND: Deploy 2-3 companion titles. Create series page. Add backmatter links. |
| Revenue $30-150/mo, BSR <500K | 📦 **FILLER** | MAINTAIN. Add to series page if one exists. |
| Revenue <$30/mo, no reviews, BSR >1M | 💀 **DEAD WEIGHT** | KILL or REFORMAT: Unpublish, redeploy as Etsy printable or Payhip toolkit. |

#### WHOP DAY 14 (Rapid Signal Check)

| Signal | Verdict | Action |
|--------|---------|--------|
| Views ≥50 + any purchase | 🟢 **ALIVE** | HOLD. Continue to Day 45. |
| Views ≥50, no purchases | 🟡 **OPTIMIZE** | Adjust pricing, thumbnail, or description. ONE change. |
| Views <15 | ❌ **KILL** | Whop surfaces fast. Invisible at Day 14 = wrong platform. Redeploy on Etsy/KDP. |

#### WHOP DAY 45 (Traction Check)

| Signal | Verdict | Action |
|--------|---------|--------|
| Purchases ≥3, Revenue ≥$75 | 🟢 **TRACTION** | SCALE. Enable affiliate program. Deploy related products. |
| Purchases 0-1 | ❌ **KILL or MIGRATE** | 45 days minimal traction = wrong platform. Migrate concept. |

#### PAYHIP / STAN STORE (Conversion-Based — No Time Thresholds)

| Signal | Verdict | Action |
|--------|---------|--------|
| Conversion >3% from 100+ visitors | 🟢 **WORKING** | Scale traffic to this page. Product page converts. |
| Conversion 1-3% from 100+ visitors | 🟡 **OPTIMIZE** | Improve product page copy, images, or pricing. |
| Conversion <1% from 100+ visitors | 🔴 **OPTIMIZE HARD** | Product page is broken. Rewrite description, adjust pricing, improve images. |
| <100 visitors | ⚪ **INSUFFICIENT DATA** | Not a platform problem — traffic problem. Improve cross-platform links or social posting. |

### Step 3: Generate Check Report

\`\`\`
PASSIVE ASSET CHECK — Day [X] — [Date]

ASSET: [Name] | Platform: [X] | Score: [X]/40 | Phase: [X]
Verdict: [emoji + classification]
Action: [specific one-line action]

ASSET: [Name] | Platform: [X] | Score: [X]/40 | Phase: [X]
Verdict: [emoji + classification]
Action: [specific one-line action]

[repeat per asset]

PORTFOLIO SUMMARY:
  Assets checked: [N]
  🟢 ALIVE/TRACTION: [N]
  🟡 OPTIMIZE: [N]
  ❌ KILL: [N]

PHASE GATE:
  [Can ROOT/BRANCH/COMPOUND phase proceed? Which assets earned the gate?]

NEXT CHECK: Day [X] on [date]
\`\`\`

### Step 4: Trigger Phase Transitions

Based on verdicts:
- **Any SEED asset hits TRACTION at Day 60** → Unlock ROOT phase. Present ROOT deployment checklist.
- **ROOT assets show signal** → Unlock BRANCH phase. Present BRANCH deployment checklist.
- **ANCHOR classification at Day 90** → Trigger COMPOUND phase. Auto-run "compound this anchor" via subagent.
- **All assets KILLED** → Route to \`/lessons\` to capture patterns. Recommend: different format, different platform, or different niche.

### Step 5: Update Pipeline State + Capture Learnings

Update \`pipeline-state.json\` passive_portfolio section with:
- Per-asset status and metrics
- Phase gate decisions
- Classification results

Auto-capture to \`/lessons\`:
- Which asset formats performed best on which platforms
- Which therapeutic forces correlated with strongest signals
- Kill patterns (wrong format? wrong platform? wrong price?)
- Platform-specific learnings (Etsy indexing behavior, KDP velocity patterns)

## Autonomy
Tier 1 — Full Auto for analysis and verdict generation.
Tier 2 — Notify & Proceed for phase gate transitions.
Tier 4 — Escalate for portfolio-wide KILL decision (all assets failed).

## Output
Check report presented inline. Pipeline state updated. Phase transitions triggered if gates met.

## Next Step
Based on verdicts: build next phase assets, optimize flagged listings, kill dead weight, or compound anchors.`;
