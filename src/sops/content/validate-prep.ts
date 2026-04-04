export const VALIDATE_PREP = `# /validate-prep — Validation Deployment Package

## What This Does

Auto-generates a complete deployment package after /deploy completes. Produces deployable assets, a step-by-step copy-paste checklist, pre-computed decision thresholds, and daily data collection templates.

## Trigger Context
Runs automatically after \`/deploy\` completes. No user input needed to start.

## Prerequisites
- All campaign assets from /deploy (landing page, emails, ad copy)
- Channel setup specs from /channels (if already run) or generates minimal viable setup
- Unit Economics guardrails (from /unit-economics)
- Buyer Research Package (for targeting parameters)

## Execution Protocol

### Step 1: Determine Validation Tier
Check pipeline-state.json:
- No previous validation → Tier 1 ($0-50/day, signal validation)
- Tier 1 passed → Tier 2 ($50-100/day, micro-validation)
- Tier 2 passed → Tier 3 (full budget, real validation)

### Step 2: Build Deployment Package

**Package Component A: SEO-Optimized Site Package**
- Take the landing page copy from \`/deploy\` output
- Wrap it in clean, deployable HTML with:
  - Responsive layout (mobile-first, sub-2s target load time)
  - Email capture form (compatible with common tools: ConvertKit, Mailchimp, Beehiiv)
  - Basic analytics snippet placeholder (Google Analytics / Meta Pixel)
  - Clear markers for where to paste tracking IDs
  - **SEO Foundation:**
    - Meta title (<60 chars) and meta description (<160 chars)
    - Canonical URL tag
    - Open Graph tags (og:title, og:description, og:image, og:url)
    - Twitter Card tags (twitter:card, twitter:title, twitter:description)
    - JSON-LD schema: Organization + Product + FAQ (extracted from FAQ section)
    - Internal links to pillar/spoke pages (if \`/content-engine\` has run)
- Save as \`assets/[market-name]/validation/tier-[N]/landing-page.html\`

- **SEO Infrastructure (ALWAYS generated — not gated on /content-engine):**
  - \`robots.txt\` with AI crawler permissions:
    \`\`\`
    User-agent: *
    Allow: /

    User-agent: GPTBot
    Allow: /

    User-agent: PerplexityBot
    Allow: /

    User-agent: ClaudeBot
    Allow: /

    User-agent: Googlebot
    Allow: /

    Sitemap: [site-url]/sitemap.xml
    \`\`\`
  - \`sitemap.xml\` — starts with just the landing page URL + lastmod date. Expanded as content pages are added.
  - **HowTo schema** — if the product has a step-by-step process (check Product Blueprint), generate HowTo JSON-LD:
    \`\`\`json
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "[Process name from Product Blueprint]",
      "step": [
        {"@type": "HowToStep", "name": "[Step 1]", "text": "[Description]"},
        {"@type": "HowToStep", "name": "[Step 2]", "text": "[Description]"}
      ]
    }
    \`\`\`

- **If \`/content-engine\` has run**, also generate:
  - **Pillar page** — full pillar content with:
    - H1/H2/H3 semantic hierarchy
    - Article schema (JSON-LD)
    - Author byline and updated date
    - Internal links to spokes and landing page
    - Breadcrumb navigation
    - Save to \`assets/[market-name]/content/pillar/[slug].html\`
  - **Spoke pages** — spoke content with:
    - Same SEO structure as pillar
    - Breadcrumb nav linking to pillar
    - Links back to pillar and adjacent spokes
    - Save to \`assets/[market-name]/content/spokes/[slug].html\`

**Package Component B: Ad Campaign Spec (Validation-Scoped)**
- Take ad copy variations from \`/deploy\`
- Scope to validation budget (NOT full campaign budget):
  - Tier 1: $20-50 total spend, 3-5 day window
  - Tier 2: $50/day, 7-14 day window
  - Tier 3: Full daily budget, 14-30 day window
- Select the TOP 2-3 ad variations only (not full creative battery)
- Format as platform-ready specs matching \`/channels\` format but minimal:

\`\`\`
VALIDATION CAMPAIGN — Tier [N]
Platform: [lowest-CPC channel from traffic strategy, or Meta as default]
Total Validation Budget: $[exact number]
Daily Cap: $[exact number]
Duration: [exact days]

AD SET: [market]-validation-tier[N]
  Audience: [exact targeting — narrowest high-confidence segment]
  Daily Budget: $[exact]/day
  Optimization: Link Clicks (Tier 1) / Conversions (Tier 2-3)

  AD 1: [copy — paste directly]
  AD 2: [copy — paste directly]
\`\`\`

**Package Component C: Email Automation Spec (if Tier 2+)**
- First 3 emails from the sequence only (not full 7)
- Pre-written subject lines and body copy
- Trigger rules and timing

**Package Component D: Tracking Setup**
- Which metrics to track at this tier (only the ones that matter — not everything)
- Where to find each metric in the platform dashboard
- Screenshot-level instructions: "In Meta Ads Manager, click Columns → Customize → add these 4 columns"

### Step 3: Generate Deployment Checklist

A numbered list of PHYSICAL ACTIONS the user takes. Each step is one action, copy-paste where possible:

\`\`\`
DEPLOYMENT CHECKLIST — [Market Name] — Tier [N]
Estimated time: 45-60 minutes

LANDING PAGE:
☐ 1. Go to [Carrd.co / your page builder]. Create new site.
☐ 2. Paste the HTML from landing-page.html (or copy sections into builder).
☐ 3. Connect your email tool: [paste API key / webhook URL into form action].
☐ 4. Add Meta Pixel: paste this code in <head>: [placeholder with instructions].
☐ 5. Publish. Copy the live URL: ________________

ADS:
☐ 6. Open Meta Ads Manager → Create Campaign → [objective from spec].
☐ 7. Create Ad Set: paste targeting from spec above.
☐ 8. Create Ad 1: paste Primary Text, Headline, Description from spec.
☐ 9. Create Ad 2: paste from spec.
☐ 10. Set daily budget to $[exact number]. Set end date to [exact date].
☐ 11. Publish campaign.

TRACKING:
☐ 12. Bookmark this dashboard view: [platform URL pattern].
☐ 13. Set a daily alarm for [time] to run /validate-check.

SEO & INDEXING (ALWAYS — baseline for every deployment):
☐ 14. Upload robots.txt to site root.
☐ 15. Upload sitemap.xml to site root.
☐ 16. Go to Google Search Console → Add Property → verify site.
☐ 17. Submit sitemap URL in Search Console → Sitemaps → Add.
☐ 18. Go to Bing Webmaster Tools → Add Site → verify → submit sitemap.
☐ 19. Run PageSpeed Insights (https://pagespeed.web.dev/) on live URL. Target: Mobile score ≥ 70, load time under 2 seconds.
☐ 20. Create an "Organic Traffic" segment in Google Analytics.

BRAND SIGNAL INFRASTRUCTURE (ALWAYS — baseline):
☐ 21. Claim Google Business Profile (if applicable) — enter business name, category, description.
☐ 22. Ensure NAP (Name, Address, Phone) is consistent across all listings.
☐ 23. Verify Organization schema is rendering (use Google Rich Results Test).

EXTENDED SEO (if /content-engine has run):
☐ 24. Verify pillar/spoke pages are indexed in Search Console.
☐ 25. Bookmark AI visibility check prompts from ai-visibility-baseline.md.

DONE. Ads will start delivering within 1-24 hours.
First /validate-check: [tomorrow's date]
Final /validate-decide: [end date]
\`\`\`

### Step 4: Pre-Compute Decision Thresholds

Pull from unit economics guardrails and set tier-specific thresholds:

\`\`\`
DECISION THRESHOLDS — Tier [N]

KILL SIGNALS (any one = stop spending):
  - $[3× target CPA] spent with zero conversions → Kill this creative
  - CTR below [0.5%] after 1,000 impressions → Kill this creative
  - Zero email signups after 100 clicks → Landing page broken or misaligned

CONCERN SIGNALS (watch, don't react yet):
  - CPA 20-50% above target → Normal early volatility. Hold.
  - CTR between [0.5-1.0%] → Below average but not dead. Give 48 more hours.
  - Signups but zero email opens → Check deliverability before blaming content.

ADVANCE SIGNALS (tier validated):
  - Tier 1: [X] email signups at <$[Y] cost per signup → Advance to Tier 2
  - Tier 2: [X] sales at CPA ≤ $[target] → Advance to Tier 3
  - Tier 3: Sustained CPA ≤ $[target] for 7+ days → Enter scaling mode

VALIDATION WINDOW:
  Start: [launch date]
  Minimum run: [X] days (don't make decisions before this)
  Maximum run: [X] days (if no signal by now, it's a kill)
  Decision date: [exact date for /validate-decide]
\`\`\`

### Step 5: Generate Daily Check Template

Pre-build the paste template for \`/validate-check\`:

\`\`\`
DAILY DATA — [Date]
Spend today: $
Impressions:
Clicks:
CTR: %
Signups/Leads:
Sales:
Notes (anything unusual):
\`\`\`

Save this template to \`assets/[market-name]/validation/tier-[N]/daily-template.txt\`

### Step 6: Save Everything and Update State

Save complete deployment package to:
\`\`\`
assets/[market-name]/validation/tier-[N]/
  landing-page.html
  ad-campaign-spec.md
  deployment-checklist.md
  decision-thresholds.md
  daily-template.txt

# SEO infrastructure (ALWAYS generated):
assets/[market-name]/content/seo-config/
  robots.txt
  sitemap.xml

# If /content-engine has run, pillar/spoke pages are in their canonical locations:
assets/[market-name]/content/pillar/       # Pillar pages
assets/[market-name]/content/spokes/       # Spoke pages
\`\`\`

Update pipeline-state.json:
- Set current_stage to \`validation_tier_[N]\`
- Record validation window dates
- Record thresholds

Present the deployment checklist to the user. This is Tier 2 (Notify & Proceed) — no approval needed for generating the package. The user decides when to execute the checklist.

### Step 7: Set Deployment Timer (Optional)

If the pipeline has triage_status set to "selected":
1. Set deployment_deadline_at to the current time plus 48 hours (ISO 8601)
2. Present the deadline to the user:
   "Deployment deadline: [exact date/time]. Deploy this checklist within the deadline."
3. daily_check will monitor the deadline and flag approaching or expired deadlines.

If triage_status is not set, skip this step.

## Autonomy
Tier 1 — Full Auto for package generation.
Tier 2 — Notify & Proceed for presenting the package.
User executes the physical deployment at their own pace.

## Output
Complete deployment package in validation folder. Checklist presented inline.

## Next Step
User executes checklist → runs \`/validate-check\` daily → runs \`/validate-decide\` at end of window.`;
