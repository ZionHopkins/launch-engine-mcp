export const CONTENT_ENGINE = `# /content-engine — Organic Content & SEO/GEO Engine

## What This Does

Defines topic clusters from buyer research, generates pillar and spoke content with SEO/GEO optimization, creates schema markup, builds a content calendar, and establishes AI visibility baselines. Produces the full organic content infrastructure parallel to paid traffic.

## Trigger Context
After \`/deploy\` completes and \`/qa\` clears. Runs parallel with \`/traffic-strategy\` — not gated on paid traffic decisions. Can also run standalone after buyer research + building blocks + product architecture are complete.

## Prerequisites
- Therapeutic Buyer Research Package (from /research): Pain Architecture, Language Bank
- Building Blocks (from /build-blocks): Named frameworks, mechanism, offer stack
- Product Architecture Blueprint (from /product): Module structure, deliverables
- Name Lock Registry (from /name-lock): All locked names for brand attribution

All four REQUIRED. If any are missing:
\`\`\`
STAGE_BLOCKED — Prerequisites not met.

Missing stages:
  - [stage]: status is "[current]", needs "complete"

Run these first:
  1. /research (if buyer research incomplete)
  2. /build-blocks (if building blocks incomplete)
  3. /product (if product architecture incomplete)
  4. /name-lock (if names not locked)
\`\`\`

## Execution Protocol

**DELEGATE TO SUBAGENT: \`content-strategist\` (task_type: "topic_cluster_research")**

### Step 0: Check Learnings
Silently check \`learnings.json\` for patterns tagged \`seo\`, \`content\`, \`organic\`, \`geo\`. If relevant patterns exist, pass them to the subagent as context.

### Step 1: Gather Inputs
Collect and pass to subagent:
- Pain Architecture (top 5 pain points with severity scores)
- Building Blocks named frameworks (Block 6 — named system/method)
- Product Blueprint module structure
- Name Lock Registry (brand name, product name, mechanism name)
- Language Bank (buyer's exact phrases)
- Market intel competitive landscape
- Any existing content assets

### Step 2: Topic Cluster Definition (Subagent — 10-15 keyword searches)
The subagent runs 10-15 web searches (5-8 for primary keywords, 5-7 for adjacent topic discovery):
- "[market] best practices [current year]"
- "[primary pain point] how to [current year]"
- "[market] guide for [target buyer]"
- "[competitor name] content strategy"
- "[pain point] vs [pain point] comparison"
- "[market] frequently asked questions"
- "[mechanism/method name] explained"
- "[market] tools templates resources"

From search data + Pain Architecture, define 3-5 pillar themes:

\`\`\`
TOPIC CLUSTER MAP

PILLAR 1: [Theme from top pain point]
  URL: /[pillar-slug]/
  Target keyword: [primary keyword]
  Search intent: [informational/commercial/transactional]
  ├── Spoke 1.1: [Sub-topic from product module]
  │   URL: /[spoke-slug]/
  │   Target keyword: [long-tail keyword]
  ├── Spoke 1.2: [Sub-topic from FAQ/objection]
  │   URL: /[spoke-slug]/
  │   Target keyword: [long-tail keyword]
  ├── Spoke 1.3: [Sub-topic from failed solutions]
  │   URL: /[spoke-slug]/
  │   Target keyword: [long-tail keyword]
  └── Sub-page 1.1.1: [Deep-dive supporting page]
      URL: /[sub-page-slug]/

PILLAR 2: [Theme from mechanism/method]
  ...

PILLAR 3: [Theme from transformation narrative]
  ...
\`\`\`

Save to \`assets/[market-name]/content/topic-cluster-map.md\`

**Content Priority Matrix (SEO x GEO):** Score each pillar and spoke by quadrant to determine publishing order:

\`\`\`
┌──────────────────┬──────────────────────────────────┐
│ HIGH SEO +       │ Pillar guides, original research, │
│ HIGH GEO         │ definitive "What is X" pages,     │
│ (publish FIRST)  │ data-driven trend roundups         │
├──────────────────┼──────────────────────────────────┤
│ HIGH SEO +       │ How-to tutorials, comparison       │
│ MEDIUM GEO       │ pages (X vs Y), tool reviews       │
│ (publish SECOND) │                                    │
├──────────────────┼──────────────────────────────────┤
│ MEDIUM SEO +     │ Thought leadership, expert          │
│ HIGH GEO         │ commentary, contrarian takes        │
│ (publish THIRD)  │ with data                           │
├──────────────────┼──────────────────────────────────┤
│ BRAND BUILDING   │ Behind-the-scenes, founder          │
│ (supports both)  │ stories, community content          │
│ (publish FOURTH) │                                    │
└──────────────────┴──────────────────────────────────┘
\`\`\`

**Scoring criteria:**
- **SEO potential** = search volume + keyword difficulty + search intent alignment
- **GEO potential** = citability (contains quotable definitions, named frameworks, specific stats) + AI query match (answers questions AI platforms are asked)
- **Pain alignment** from buyer research is the tie-breaker within each quadrant

Sort the content calendar by this priority matrix — highest-impact pieces publish in Month 1.

### Step 2.5: Generate Definitive "What is [Framework]?" Page (FIRST PRIORITY)

Before generating any other pillar content, create ONE definitive page answering "What is [Named Framework from Building Block 6]?"

This is the **single highest GEO-value page** in your entire content library. When someone asks ChatGPT or Perplexity "What is [Your Method]?", this page is the canonical source they cite.

**Requirements:**
- H1: "What is [Named Framework]? The Complete Guide"
- First paragraph: One-sentence quotable definition (AI-citable verbatim)
- First 200 words: definition + origin story + specific stat + brand name
- Body: how it works (step-by-step), who it's for, results/proof, FAQ
- Citation magnets: at least 3 (the definition itself, a specific stat, a named sub-process)
- Schema: FAQ schema + Article schema + HowTo schema (if step-by-step process)
- Internal links: link to every pillar as "the [Named Framework] applied to [topic]"

Save to \`assets/[market-name]/content/pillar/what-is-[framework-slug].md\` — this is published FIRST in the content calendar, before any other pillar.

### Step 3: Pillar Content Generation (Subagent — 0 searches)
For each remaining pillar, generate a 2,000-4,000 word guide:

**First-200-Words Rule (MANDATORY):**
The first 200 words of every pillar page must contain:
1. A specific stat or data point (from market intel research)
2. The primary value proposition
3. The brand/product name (from Name Lock Registry)
4. A clear statement of what the reader will learn

This front-loads the information AI models extract for citations.

**Citation Magnets (at least 2 per pillar):**
- Named framework from Building Block 6 (e.g., "The [Name] Method")
- Original statistic or data synthesis from market intel
- Quotable definition that AI models can cite verbatim
- Proprietary model or process diagram description

**EEAT Signals:**
- Author byline with credentials
- "Last updated: [date]" prominently placed
- Links to primary sources
- Experience markers ("Based on [X] clients/projects/years")

**Structure:**
- H1: Primary keyword + compelling angle
- H2s: Framed as questions (featured snippet optimization)
- H3s: Specific sub-answers
- Internal links to spoke pages (2-3 per pillar)
- FAQ section at bottom (maps to FAQ schema)
- **Image alt text:** All images use format \`"[keyword] — [description]"\` (e.g., \`"email marketing funnel — 5-step conversion diagram"\`)

Save each pillar to \`assets/[market-name]/content/pillar/[slug].md\`

### Step 4: Spoke Page Generation (Subagent — 0 searches)
For each spoke, generate 1,000-2,000 words:

- Same first-200-words rule (stat + value prop + brand name)
- Same citation magnet requirement (at least 1 per spoke)
- Link back to parent pillar page
- Link to 1-2 adjacent spokes (topic cluster interlinking)
- H2/H3 as questions
- Practical, actionable content derived from product modules
- **Image alt text:** \`"[keyword] — [description]"\` format on all images

Save each spoke to \`assets/[market-name]/content/spokes/[slug].md\`

### Step 5: Schema Markup Generation
Generate JSON-LD schema files for each page:

**Organization Schema** (site-wide):
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Brand Name from Name Lock]",
  "url": "[site URL]",
  "description": "[from Building Blocks]",
  "sameAs": ["[social profile URLs]"]
}
\`\`\`

**Article Schema** (per pillar/spoke):
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[page title]",
  "author": {"@type": "Person", "name": "[author]"},
  "datePublished": "[date]",
  "dateModified": "[date]",
  "description": "[meta description]"
}
\`\`\`

**FAQ Schema** (per page with FAQ section):
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "[Q]", "acceptedAnswer": {"@type": "Answer", "text": "[A]"}}
  ]
}
\`\`\`

**HowTo Schema** (if product has step-by-step process)
**Product Schema** (for product/offer pages)

Save to \`assets/[market-name]/content/schema/[page-slug]-schema.json\`

### Step 6: Brand Signal Checklist & SEO Config
Generate:

**robots.txt:**
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

**sitemap.xml** — auto-generated list of all pages with lastmod dates

**Brand Signal Checklist:**
\`\`\`
BRAND SIGNAL CHECKLIST — [Brand Name]

☐ Google Business Profile created and verified
☐ Social profiles created (LinkedIn, Twitter/X, YouTube) with consistent NAP
☐ robots.txt uploaded with AI crawler permissions
☐ XML sitemap submitted to Google Search Console
☐ XML sitemap submitted to Bing Webmaster Tools
☐ NAP (Name, Address, Phone) consistent across all listings
☐ Organization schema deployed on homepage
☐ Twitter Card tags on all pages (twitter:card, twitter:title, twitter:description, twitter:image)
☐ Author pages created with credentials
☐ About page with EEAT signals
\`\`\`

Save to \`assets/[market-name]/content/seo-config/\`

### Step 7: Content Calendar
Generate a 6-month content calendar:

\`\`\`
CONTENT CALENDAR — [Market Name]

MONTH 1:
  Week 1: PUBLISH — Pillar 1 + Spoke 1.1
  Week 2: REPURPOSE — Run /content-repurpose on Pillar 1
  Week 3: PUBLISH — Spoke 1.2 + Spoke 1.3
  Week 4: AUDIT — AI visibility check (manual prompts below)

MONTH 2:
  Week 1: PUBLISH — Pillar 2 + Spoke 2.1
  Week 2: REPURPOSE — Run /content-repurpose on Pillar 2
  Week 3: PUBLISH — Spoke 2.2 + Spoke 2.3
  Week 4: AUDIT — Run /seo-check (first monthly audit)

MONTH 3:
  Week 1: PUBLISH — Pillar 3 + Spoke 3.1
  Week 2: REPURPOSE — Run /content-repurpose on Pillar 3
  Week 3: ORIGINAL RESEARCH — Publish 1 data piece (aggregate pipeline data:
           market intel stats, validation results, buyer survey findings).
           This is your strongest GEO asset. Format as citable statistics
           that other sites and AI models reference.
  Week 4: AUDIT — Run /seo-check

MONTHS 4-5:
  [Continue pillar/spoke/repurpose pattern]
  [Refresh cycle begins Month 4 — revisit Month 1 content for decay]

MONTH 6:
  Week 1: PUBLISH — Remaining spokes
  Week 2: REPURPOSE — Final batch
  Week 3: ORIGINAL RESEARCH — Second data piece (aggregated results,
           updated stats, case study with specific numbers)
  Week 4: AUDIT — Run /seo-check --mode deep (quarterly deep dive)
\`\`\`

Save to \`assets/[market-name]/content/content-calendar.md\`

### Step 8: AI Visibility Baseline
Generate prompt templates for manual AI citation checks:

\`\`\`
AI VISIBILITY BASELINE — [Market Name]

CHECK MONTHLY (5 minutes):

ChatGPT Prompts:
  1. "What is [named framework from Block 6]?"
  2. "Best [solution category] for [target buyer]?"
  3. "How to [primary pain point transformation]?"

Perplexity Prompts:
  1. "[Brand name] review"
  2. "[Primary keyword] guide"
  3. "Best [product category] [current year]"

Google AI Overview:
  1. Search "[primary keyword]" — check if AI Overview appears, check if cited
  2. Search "[named framework]" — check if brand is mentioned
  3. Search "[pain point] solution" — check if content appears

Bing Copilot:
  1. Ask "[primary keyword] guide [current year]"
  2. Ask "What is [named framework]?"

Meta AI:
  1. Ask "Best [solution category] for [target buyer]?"

TRACKING:
Date: ___  ChatGPT: Y/N  Perplexity: Y/N  AI Overview: Y/N  Bing Copilot: Y/N  Meta AI: Y/N  Citation copy: ___
Date: ___  ChatGPT: Y/N  Perplexity: Y/N  AI Overview: Y/N  Bing Copilot: Y/N  Meta AI: Y/N  Citation copy: ___
\`\`\`

Save to \`assets/[market-name]/content/ai-visibility-baseline.md\`

### Step 9: Save Everything and Update State

Update pipeline-state.json with organic_growth section:
\`\`\`json
{
  "organic_growth": {
    "status": "content_engine_complete",
    "content_engine": {
      "status": "complete",
      "completed_at": "[timestamp]",
      "topic_clusters": [N],
      "pillar_pages": [N],
      "spoke_pages": [N],
      "schema_files": [N]
    },
    "content_repurpose": {
      "status": "pending",
      "batches_completed": 0
    },
    "seo_checks": {
      "last_check": null,
      "next_check": "[date — 30 days from now]",
      "checks_completed": 0
    },
    "ai_visibility": {
      "baseline_created": true,
      "last_check": null,
      "chatgpt_mentioned": null,
      "perplexity_mentioned": null,
      "ai_overview_appeared": null
    },
    "content_calendar": {
      "months_planned": 6,
      "current_month": 1,
      "pieces_published": 0,
      "pieces_repurposed": 0
    },
    "output_files": [
      "assets/[market-name]/content/topic-cluster-map.md",
      "assets/[market-name]/content/content-calendar.md",
      "assets/[market-name]/content/ai-visibility-baseline.md"
    ]
  }
}
\`\`\`

## Autonomy
Tier 1 — Full Auto for topic cluster research, content generation, schema generation.
Tier 2 — Notify & Proceed for presenting the content strategy and calendar.
Tier 2 — **Publish gate:** Content generation is Tier 1, but marking content as "ready to publish" (adding to the live site) requires user approval. Present each batch of generated content for review before it goes live. This prevents mass-producing AI content without human oversight.
Tier 3 — Recommend & Wait for topic cluster selection when pain points score similarly.

## Output
Complete content package in \`assets/[market-name]/content/\`. Topic cluster map, pillar pages, spoke pages, schema markup, SEO config, content calendar, AI visibility baseline.

## Next Step
Run \`/content-repurpose\` on the first pillar page → Run \`/seo-check\` at Month 1 Week 4 → Continue calendar cadence.`;
