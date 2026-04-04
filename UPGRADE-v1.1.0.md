# Asset Factory v1.1.0 — Upgrade Analysis

## What Changed

### Published (v1.0.2) vs This Update (v1.1.0)

| Metric | v1.0.2 | v1.1.0 | Delta |
|--------|--------|--------|-------|
| SOP Tools | 35 | 39 | **+4 new** |
| Subagents | 12 | 14 | **+2 new** |
| Architecture Layers | 4 | 5 | **+1 (Organic Growth Engine)** |
| QA Checks (deploy → live) | 1 gate | 3 gates | **+2 automated test gates** |
| Automated test modules | 0 | 4 Python modules | **New QA test suite** |

---

## New Features

### 1. Automated QA Test Suite

**Problem it solves:** In v1.0.2, QA was a single persona-alignment pass. Structural issues — exposed API keys in HTML, email subject lines over 60 chars, missing CTAs, broken HTML tags, placeholder text, math errors in unit economics — could ship to production undetected.

**What v1.1.0 adds:**

4 Python test modules that run at 3 points in the pipeline:

| Gate | When | What It Catches |
|------|------|----------------|
| **Pre-Deploy** | Before campaign-builder generates assets | Missing research sections, broken unit economics math (margins <= 0, CAC >= LTV), cross-report contradictions, placeholder text in research |
| **Post-Deploy** | After assets are written, before persona QA | HTML validity, missing viewport meta, exposed API keys, email subject lines > 60 chars, missing ad variation components, brand name inconsistency, placeholder text |
| **Post-QA** | After persona corrections are applied | Verifies corrections didn't introduce new structural issues |

Each gate auto-fixes failures (Tier 1 autonomy) and re-runs up to 3-5 iterations before escalating.

**Test modules:**
- `test_landing_page.py` — HTML structure, CTA presence, mobile meta, secret detection (provider-specific patterns: Stripe, Brevo, OpenAI, Google, GitHub, Apify, Tavily), link validation
- `test_campaign_assets.py` — Email subject line length, ad variation structure (supports both `**Bold**` and `### Heading` formats), word counts, form question validation, brand name consistency via Name Lock Registry
- `test_research_report.py` — Required sections per report type, citation density scoring, contradiction detection (table-aware to avoid false positives), Language Bank depth, Pain Architecture depth, cross-report consistency (awareness/sophistication level alignment between buyer research and building blocks)
- `test_unit_economics.py` — Margin positivity, CAC/LTV ratio validation, percentage range checks, verdict presence, pipeline-state cross-validation

**Includes:**
- `qa_runner.py` — Test discovery, execution, structured JSON reports with per-failure fix instructions
- `qa_loop.sh` — Headless fix loop: runs tests → feeds failures to Claude → re-runs, up to 5 iterations

### 2. Organic Growth Engine (New Architecture Layer)

**Problem it solves:** v1.0.2 has paid traffic only. Organic search + AI citations compound over months but there was no systematic way to build for them.

**4 new tools:**

| Tool | Purpose |
|------|---------|
| `content_engine` | Topic cluster research from buyer pain points → pillar/spoke/sub-page content generation with SEO/GEO optimization, schema markup, content calendars, AI visibility baselines |
| `content_repurpose` | Single-pass: takes one pillar page → generates 7+ platform-native assets (YouTube scripts, short-form video, Reddit, LinkedIn, newsletters, social) |
| `seo_check` | Monthly SEO/GEO audit — content health, AI citation tracking, competitive gaps, technical SEO, content freshness scoring with decay detection |
| `tournament` | Parallel Portfolio Tournament — batch-evaluates 3-5 business ideas through Layer 1 simultaneously with comparison gates. ~50-60% faster than sequential /scout runs |

**2 new subagents:**
- `content-strategist` — Powers `/content-engine` and `/content-repurpose` (Tavily + Apify for Reddit + Firecrawl)
- `seo-auditor` — Powers `/seo-check` (5-phase audit with competitive analysis)

**New output structure:**
```
assets/[market-name]/content/
  topic-cluster-map.md
  content-calendar.md
  ai-visibility-baseline.md
  pillar/            # 2,000-4,000 word guides
  spokes/            # 1,000-2,000 word pages
  repurposed/[slug]/ # 7+ platform files per source
  schema/            # JSON-LD (Organization, Article, FAQ)
  seo-config/        # robots.txt, sitemap.xml, brand-signal-checklist.md
  audits/            # Monthly audit reports
```

### 3. SEO-First Asset Generation

**Problem it solves:** In v1.0.2, landing pages were copy-focused only. SEO and AI discoverability were afterthoughts — no meta tags, no schema markup, no citation optimization.

**What v1.1.0 adds to `/deploy`:**
- Meta title + description generation
- Open Graph + Twitter Card tags
- JSON-LD schema blocks (Organization, Product, FAQ, Review)
- EEAT signals (author credentials, dates, specific stats)
- Citation magnets (named frameworks + specific data points)
- First-200-words rule enforcement
- H2/H3 hierarchy optimized for both conversion AND featured snippets
- FAQ sections structured for schema extraction
- Landing pages saved as `.html` (complete HTML5) instead of `.md`

**What v1.1.0 adds to `/qa`:**
- Optional Check 8: Technical/SEO Structure Alignment (advisory, non-blocking)
- Runs when organic growth engine is active or platform supports organic traffic
- Verifies H1 keywords, H2 question framing, FAQ presence, meta descriptions, first-200-words rule

### 4. Pipeline Resilience Improvements

**New CLAUDE.md sections that improve pipeline reliability:**

| Section | What It Does |
|---------|-------------|
| **Pipeline Execution** | Explicit prerequisite enforcement — stages abort with clear STAGE_BLOCKED message listing what to run first |
| **Security** | Never expose API keys in client-side code. Double-check before writing browser-runnable files |
| **Sub-Agent Error Recovery** | 4-step protocol: (1) auth pre-flight, (2) directory verification, (3) checkpoint saves to `.claude/checkpoints/`, (4) graceful exit with structured error on credit/auth failures |
| **Communication** | Intermediate status updates during long operations. User never has to ask "have you started?" |
| **Automated Agent Rules** | Credit/token balance check before multi-step work. Warn and prioritize if low |
| **Publishing & Deployment** | Use existing npm auth tokens. Never rely on interactive 2FA in automated sessions |

### 5. PostWrite Hook

New hook in settings that scans Write/Edit operations for API key exposure in client-side files (`.html`, `.js`, `.ts`):

```json
{
  "hooks": {
    "postToolUse": [{
      "type": "command",
      "command": "if echo \"$TOOL_INPUT\" | grep -qi 'api_key\\|secret\\|token' && echo \"$TOOL_INPUT\" | grep -qi '.html\\|.js\\|.ts'; then echo 'WARNING: Possible API key exposure' >&2; fi",
      "toolNames": ["Write", "Edit"]
    }]
  }
}
```

---

## Pipeline Flow Comparison

### v1.0.2
```
/deploy → write assets → /qa (persona only) → /validate-prep
```

### v1.1.0
```
/deploy Step 0: prerequisites
/deploy Step 1: PRE-DEPLOY GATE (research + unit economics tests)
         ↓
Campaign-builder writes assets (with SEO/schema/meta tags)
         ↓
/deploy POST-DEPLOY GATE (landing page + campaign asset tests)
         ↓
/qa: persona-qa subagent (7-check alignment + optional SEO check 8)
         ↓
/qa POST-QA VERIFICATION (structural re-check after corrections)
         ↓
/validate-prep
         ↓
    ┌────┴────┐
    ↓         ↓
  PAID     ORGANIC (NEW)
  /traffic  /content-engine → /content-repurpose → /seo-check
```

---

## Files Changed

### New Files
- `qa-tests/__init__.py`
- `qa-tests/test_landing_page.py`
- `qa-tests/test_campaign_assets.py`
- `qa-tests/test_research_report.py`
- `qa-tests/test_unit_economics.py`
- `qa-tests/qa_runner.py`
- `qa-tests/qa_loop.sh`
- `.claude/commands/content-engine.md` (new command)
- `.claude/commands/content-repurpose.md` (new command)
- `.claude/commands/seo-check.md` (new command)
- `.claude/commands/tournament.md` (new command)
- `.claude/agents/content-strategist.md` (new agent)
- `.claude/agents/seo-auditor.md` (new agent)

### Modified Files
- `.claude/commands/deploy.md` — Pre-deploy gate, SEO foundation, post-deploy structural check
- `.claude/commands/qa.md` — Post-QA verification, SEO structure check (Check 8), enhanced state tracking
- `CLAUDE.md` — 6 new operational sections (Security, Error Recovery, Communication, Agent Rules, Publishing, Prerequisites)

---

## Breaking Changes

None. All changes are additive. Existing pipelines run identically — the new test gates auto-execute within existing `/deploy` and `/qa` flows. The organic growth tools are optional parallel paths.

## Requirements

- Python 3.10+ (for qa-tests/ test suite)
- Claude Code CLI (for qa_loop.sh headless fix mode)
