# Launch Engine

**Business Execution OS as an MCP server.** Full pipeline from idea to revenue — for solo founders and bootstrappers.

Launch Engine gives any MCP-compatible AI client (Claude Desktop, Cursor, Windsurf, etc.) a complete business execution system: 35 SOP tools covering market research, offer design, product architecture, campaign deployment, validation, traffic, and optimization — plus 3 utility tools for state management.

## Quick Start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "launch-engine": {
      "command": "npx",
      "args": ["-y", "@launch-engine/mcp"],
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
      "args": ["-y", "@launch-engine/mcp"],
      "env": {
        "LAUNCH_ENGINE_PROJECT_DIR": "/path/to/your/project"
      }
    }
  }
}
```

### From Source

```bash
git clone https://github.com/launch-engine/mcp.git
cd mcp
npm install
npm run build
node dist/index.js
```

## How It Works

Launch Engine is a **two-layer tool system**:

**Layer A — 35 SOP Tools** (read-only): Each tool validates prerequisites against `pipeline-state.json`, loads upstream context from previous stages, checks `learnings.json` for patterns, and returns full SOP instructions enriched with that context. Your AI executes the instructions.

**Layer B — 3 Utility Tools** (mutations): `update_pipeline_state`, `save_asset`, `capture_learning`. These handle all state writes and file creation. Your AI calls them after executing each SOP.

## The Pipeline

```
Three entry points:

1. scout        → Full pipeline (research → offer → build → deploy → validate)
2. rapid_test   → Quick $50-100 test (signal in 3-5 days)
3. passive_deploy → Marketplace assets (after research)
```

### Full Pipeline Flow

```
LAYER 1 (Strategist):
  scout → autonomy → market_intel → research → build_blocks → stress_test → unit_economics

LAYER 2 (Builder):
  name_lock → platform + product → deploy → qa → validate_prep

LAYER 3 (Validator):
  validate_check (daily) → validate_decide → feedback → iterate

TRAFFIC:
  traffic_strategy → channels → creative_test → funnel_optimize → scale

CROSS-CUTTING:
  status | daily_check | lessons | voice_extract | dream_100
```

Each tool checks prerequisites automatically. If you try to run `research` before completing `market_intel`, you'll get a clear STAGE_BLOCKED message telling you exactly what to run first.

## Tools Reference

### SOP Tools (35)

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
        └── rapid-test/       # Rapid test assets
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

## License

MIT
