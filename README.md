# Launch Engine

[![npm version](https://img.shields.io/npm/v/launch-engine-mcp.svg)](https://www.npmjs.com/package/launch-engine-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/ZionHopkins/launch-engine-mcp.svg?style=social)](https://github.com/ZionHopkins/launch-engine-mcp)

**Agentic Business Pipeline OS as an MCP server.** Full pipeline from idea to revenue — for solo founders and bootstrappers.

```bash
npx -y launch-engine-mcp
```


![Launch Engine Demo](https://github.com/ZionHopkins/launch-engine-mcp/releases/download/untagged-475ca324e940ae1c1a8c/demo.gif)

---

## Why Launch Engine?

Most MCP servers give you one tool. A GitHub integration. A database query. A Slack bot.

Launch Engine gives you **39 tools that work as a pipeline** — the entire playbook from raw idea to validated revenue, running inside the AI client you already use.

- **No more blank-page paralysis.** Start with `scout` and the system tells you exactly what to do next, every step of the way.
- **Every stage feeds the next.** Buyer research flows into offer design. Offer design flows into campaign copy. Campaign copy flows into validation. Nothing is wasted.
- **Math before assets.** Unit economics are validated before you build anything. You'll never spend weeks building an offer that can't work at your budget.
- **Test ideas for $50, not $5,000.** `rapid_test` gives you signal in 3-5 days with a landing page and paid traffic — before you commit to the full pipeline.
- **Your AI becomes a co-founder, not a chatbot.** It doesn't just answer questions. It executes a structured business system with you.

---

## Install

```bash
npm install -g launch-engine-mcp
```

Or run directly without installing:

```bash
npx -y launch-engine-mcp
```

## Quick Start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "launch-engine": {
      "command": "npx",
      "args": ["-y", "launch-engine-mcp"],
      "env": {
        "LAUNCH_ENGINE_PROJECT_DIR": "/path/to/your/project"
      }
    }
  }
}
```

### Cursor

Add to your MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "launch-engine": {
      "command": "npx",
      "args": ["-y", "launch-engine-mcp"],
      "env": {
        "LAUNCH_ENGINE_PROJECT_DIR": "/path/to/your/project"
      }
    }
  }
}
```

### From Source

```bash
git clone https://github.com/ZionHopkins/launch-engine-mcp.git
cd launch-engine-mcp
npm install
npm run build
node dist/index.js
```

## How It Works

Launch Engine is a **two-layer tool system**:

**Layer A — 39 SOP Tools** (read-only): Each tool validates prerequisites against `pipeline-state.json`, loads upstream context from previous stages, checks `learnings.json` for patterns, and returns full SOP instructions enriched with that context. Your AI executes the instructions.

**Layer B — 3 Utility Tools** (mutations): `update_pipeline_state`, `save_asset`, `capture_learning`. These handle all state writes and file creation. Your AI calls them after executing each SOP.

## The Pipeline

```
Four entry points:

1. scout        → Full pipeline (research → offer → build → deploy → validate)
2. rapid_test   → Quick $50-100 test (signal in 3-5 days)
3. passive_deploy → Marketplace assets (after research)
4. tournament   → Batch-evaluate 3-5 ideas through Layer 1 simultaneously
```

### Full Pipeline Flow

```
LAYER 1 (Strategist):
  scout → autonomy → market_intel → research → build_blocks → stress_test → unit_economics

LAYER 2 (Builder):
  name_lock → platform + product → deploy → qa → validate_prep

LAYER 3 (Validator):
  validate_check (daily) → validate_decide → feedback → iterate

TRAFFIC (Paid):
  traffic_strategy → channels → creative_test → funnel_optimize → scale

ORGANIC GROWTH (runs parallel with paid):
  content_engine → content_repurpose → seo_check (monthly)

CROSS-CUTTING:
  status | daily_check | lessons | voice_extract | dream_100 | tournament
```

Each tool checks prerequisites automatically. If you try to run `research` before completing `market_intel`, you'll get a clear STAGE_BLOCKED message telling you exactly what to run first.

## Tools Reference

### SOP Tools (39)

| Tool | Description | Prerequisites |
|------|-------------|---------------|
| `scout` | Market scanning — takes a raw idea, determines viability | None (entry point) |
| `autonomy` | Agent Autonomy Score — AI-buildable product viability | scout |
| `market_intel` | Deep market research with competitive scoring | scout, autonomy |
| `research` | Therapeutic Buyer Engine — deep persona research | market_intel |
| `build_blocks` | 7 Building Blocks from buyer research | research |
| `stress_test` | Offer scoring across 10 dimensions | build_blocks |
| `unit_economics` | CPA, LTV, break-even modeling | stress_test |
| `name_lock` | Lock business/product name | stress_test, unit_economics |
| `platform` | Tech stack selection and scoring | stress_test |
| `product` | Product architecture design | stress_test, name_lock |
| `deploy` | Sales pages, emails, ad copy generation | name_lock, platform, product |
| `qa` | 7-check persona alignment gate | deploy |
| `validate_prep` | Validation deployment package | deploy, qa |
| `validate_check` | Daily 60-second health check | validate_prep |
| `validate_decide` | End-of-window verdict | validate_prep |
| `feedback` | Performance diagnosis and fix routing | deploy |
| `traffic_strategy` | Traffic channel research and scoring | deploy |
| `channels` | Channel setup and configuration | traffic_strategy |
| `creative_test` | Ad creative variation testing | channels |
| `funnel_optimize` | CRO testing across conversion funnel | channels |
| `scale` | Systematic scaling of validated channels | creative_test |
| `traffic_analytics` | Performance reporting and attribution | channels |
| `dream_100` | Relationship strategy and outreach | research |
| `passive_deploy` | Marketplace asset scoring and specs | research |
| `passive_check` | Scheduled performance checks | passive_deploy |
| `passive_compound` | Deploy related assets around anchors | passive_deploy |
| `passive_portfolio` | Quarterly portfolio review | passive_deploy |
| `rapid_test` | Quick idea test — landing page + ads | None (entry point) |
| `rapid_check` | Daily metrics vs. thresholds | rapid_test |
| `rapid_graduate` | Graduate test to full pipeline | rapid_check |
| `rapid_status` | Dashboard of all rapid tests | None |
| `status` | Pipeline status report | None |
| `daily_check` | 5-minute daily operations pulse | Live campaigns |
| `lessons` | Pattern library — capture and retrieve | None |
| `voice_extract` | Brand voice extraction from content | qa |
| `content_engine` | Topic cluster research, SEO/GEO content generation | qa, validate_prep |
| `content_repurpose` | Single-pass multi-platform content repurposing | content_engine |
| `seo_check` | Monthly SEO/GEO audit with AI citation tracking | content_engine |
| `tournament` | Batch-evaluate 3-5 ideas through Layer 1 | None (entry point) |

### Utility Tools (3)

| Tool | Description |
|------|-------------|
| `update_pipeline_state` | Update pipeline-state.json with dot-notation paths |
| `save_asset` | Save files to assets/[market-name]/ directory |
| `capture_learning` | Capture reusable patterns to learnings.json |

## Project Directory Structure

Launch Engine creates and manages files in your project directory:

```
your-project/
├── pipeline-state.json      # Pipeline progress tracking
├── learnings.json            # Pattern library across pipelines
└── assets/
    └── [market-name]/
        ├── research/         # Scout reports, buyer research, market intel
        ├── building-blocks/  # The 7 Building Blocks
        ├── product/          # Product Architecture Blueprint
        ├── copy/             # Sales letters, email sequences
        ├── campaigns/        # Landing pages, ad copy
        ├── traffic/          # Traffic strategy, creative tests, analytics
        ├── validation/       # Deployment packages, daily checks, verdicts
        ├── voice/            # Brand voice calibration
        ├── passive-portfolio/ # PADA outputs
        ├── rapid-test/       # Rapid test assets
        └── content/          # Organic growth engine outputs
            ├── pillar/       # 2,000-4,000 word guides
            ├── spokes/       # 1,000-2,000 word pages
            ├── repurposed/   # Multi-platform assets per source
            ├── schema/       # JSON-LD files
            ├── seo-config/   # robots.txt, sitemap, brand signals
            └── audits/       # Monthly SEO/GEO audit reports
```

## Configuration

The project directory is resolved in order:
1. `LAUNCH_ENGINE_PROJECT_DIR` environment variable
2. `--project-dir=` CLI argument
3. Current working directory

## First Use

When you run `status` with no existing pipeline, you'll see:

> **Three paths available:**
> 1. **rapid_test** — $50-100 paid traffic test in 3-5 days
> 2. **scout** — Full active pipeline with deep research and validation
> 3. **passive_deploy** — Marketplace assets (requires research first)

## Best Practices

### Getting Started

- **Start with `status`** — always run this first. It reads your pipeline state and tells you exactly where you are and what to do next.
- **New idea? Use `rapid_test` first** — don't run the full pipeline on an unvalidated idea. Spend $50-100 to get signal in 3-5 days. If it graduates, then run `scout`.
- **One pipeline at a time** — you can run multiple rapid tests in parallel, but focus on one full pipeline at a time. Context switching kills momentum.

### During the Pipeline

- **Follow the order** — the prerequisite system exists for a reason. Each stage feeds the next. Skipping `market_intel` means `research` has no competitive context. Skipping `stress_test` means you might build assets for a broken offer.
- **Don't skip `qa`** — it catches promise-product misalignment, unattributed statistics, and persona drift. Every asset that touches a buyer must clear the QA gate.
- **Run `daily_check` every day** during validation — it takes 60 seconds and catches problems before they burn budget.
- **Use `lessons` after every major decision** — verdicts (ADVANCE/KILL), graduated rapid tests, creative test winners. The pattern library makes every future pipeline smarter.

### Working with the AI

- **Let the AI execute the full SOP** — each tool returns complete instructions. Don't interrupt midway. Let it finish the research, generate the deliverables, and save the files.
- **Review Tier 3/4 decisions carefully** — the system will pause and ask for your input on market selection, pricing, kill decisions, and anything involving real money. These pauses are intentional.
- **Trust the math** — `unit_economics` will tell you if the numbers work at your budget. If the verdict is NON-VIABLE, don't try to force it. Move on or adjust the offer.

### Scaling

- **Validate before you scale** — `scale` requires proven creative winners with 30+ conversions. Scaling unvalidated campaigns is the fastest way to burn money.
- **Compound your learnings** — passive assets that reach ANCHOR status should trigger `passive_compound`. One proven asset can spawn 5-10 related assets.
- **Run `traffic_analytics` weekly** — attribution drift happens. What worked last week may not work next week. Stay on top of the data.

### Common Mistakes to Avoid

- **Don't build assets before `stress_test` passes** — a GO verdict means the offer is structurally sound. REVISE or REBUILD means fix the foundation first.
- **Don't skip `name_lock`** — changing the business name after assets are built means rebuilding everything. Lock it early.
- **Don't ignore KILL signals** — if rapid test metrics hit kill thresholds, kill it. If validation says KILL, capture the lessons and move on. Sunk cost is not a strategy.
- **Don't publish without `qa` clearance** — unvetted copy with unattributed claims or persona misalignment damages trust and conversion rates.
- **Don't run the full pipeline for every idea** — that's what `rapid_test` is for. Test 5-10 ideas cheaply, then invest the full pipeline in the winner.

## Automated QA Test Suite (New in v1.1.0)

The pipeline includes an automated QA test suite that runs at 3 points:

| Gate | When | What It Catches |
|------|------|----------------|
| **Pre-Deploy** | Before `deploy` generates assets | Missing research, broken unit economics math, placeholder text |
| **Post-Deploy** | After assets written, before `qa` | HTML issues, exposed API keys, email subject length, missing CTAs |
| **Post-QA** | After persona corrections | Structural issues introduced by corrections |

Test modules in `qa-tests/`:
- `test_landing_page.py` — HTML structure, CTA presence, secret detection
- `test_campaign_assets.py` — Email/ad validation, brand consistency
- `test_research_report.py` — Section completeness, citation density, contradiction detection
- `test_unit_economics.py` — Margin positivity, CAC/LTV ratio, math verification

**Requires:** Python 3.10+

## Listings

Listed on [MCP Server Hub](https://mcpserverhub.net/) | [MCP Registry](https://registry.modelcontextprotocol.io)

## License

MIT
