# Launch Engine v1.2.0 — Upgrade Analysis

## What Changed

### v1.1.0 vs v1.2.0

| Metric | v1.1.0 | v1.2.0 | Delta |
|--------|--------|--------|-------|
| **SOP Tools** | 39 | 42 | **+3** (bold_action, portfolio_triage, revenue_review) |
| **Subagents** | 14 | 15 | **+1** (bold-action-strategist) |
| **Pipeline State Fields** | ~20 per pipeline | ~30 per pipeline | **+10 optional revenue fields** |
| **State Version** | 3.0 | 3.1 | Minor bump — additive only |

## New Features

### 1. Bold Action Command + Subagent

**Tool:** `bold_action`  
**Subagent:** `bold-action-strategist`  
**Layer:** Layer 2 (post-QA)  
**Prerequisites:** QA Gate complete

Identifies the single highest-leverage, strategically irreversible move that compresses credibility and expands surface area to the ICP. Produces a full execution playbook — not a list of ideas, but a decisive recommendation with everything needed to execute.

**Bold Action = Strategic Irreversibility x Audience Asymmetry**

Three properties that must ALL be present:
1. Irreversibility — permanently shifts perception
2. Credibility Compression — communicates deep expertise in one shot
3. Surface Area Expansion — reaches new people through channels where competitors are absent

### 2. Revenue Phase System (Optional Overlay)

An optional overlay that tracks revenue progression through four phases:

| Phase | Goal | Gate to Advance |
|-------|------|-----------------|
| Signal | Get intent to buy expressed | Email signup, deposit, DM response |
| Cash | Close first sale | First sale at any price |
| Repeat | Close 3+ at same price | 3 cumulative sales |
| Scale | Hit target MRR | Sustained monthly revenue |

**How to enable:** Run `portfolio_triage` to select active pipelines. Selected pipelines automatically get `revenue_phase: "signal"`. Run `revenue_review` weekly to track progress.

**Pipeline state fields added (all optional):**
- `revenue_phase` — Current phase (signal/cash/repeat/scale/archived)
- `revenue_phase_gates` — Per-phase status tracking
- `revenue_milestones` — Key date milestones (first sale, etc.)
- `first_revenue_date` — Date of first revenue
- `days_to_first_sale` — Calculated from pipeline creation
- `triage_status` — selected/archived/pending_triage
- `triage_rank` — Numeric rank from portfolio triage
- `triage_score` — Profit Velocity Score
- `deployment_deadline_at` — Optional deployment timer
- `deployment_initiated_at` — When deployment was started

### 3. Portfolio Triage

**Tool:** `portfolio_triage`  
**Layer:** Cross-cutting (entry point)  
**Prerequisites:** None (reads all pipelines)

Ranks all pipelines past unit-economics by **Profit Velocity Score**:

```
triage_score = (LTV / sales_cycle_days) x (autonomy / 35) x (stress_score / 50)
```

Recommends top N pipelines (configurable, default 3) for active focus. Suggests archiving the remainder. This is a recommendation — users choose the final selection.

**Input parameters:**
- `max_active` (optional, default 3) — Maximum pipelines to recommend

### 4. Weekly Revenue Review

**Tool:** `revenue_review`  
**Layer:** Cross-cutting (entry point)  
**Prerequisites:** None (reads selected pipelines)

Weekly check-in comparing actual revenue to projections for selected pipelines. Manages revenue phase transitions and routes iteration when behind projections.

Key features:
- Revenue phase gate checks (Signal/Cash/Repeat/Scale)
- Behind-projection routing (suggests specific SOPs to run)
- Weekly summary with money in vs. money out

### 5. Sales Cycle Filter at Scout

Scout now includes a **Step 3.5: Sales Cycle Reality Check** that estimates the market's sales cycle length. Results are stored as `sales_cycle_estimate_days` in the scout stage entry.

Color coding:
- GREEN (<=14 days): Fast cycle, ideal for rapid validation
- YELLOW (15-30 days): Moderate, needs longer validation windows
- RED (>30 days): Slow cycle, requires patience and deeper budget

This does NOT block the pipeline — it informs portfolio triage priority.

### 6. Deployment Timer

`validate_prep` now optionally sets a `deployment_deadline_at` timestamp for triaged pipelines. `daily_check` monitors the deadline and flags approaching or expired deadlines.

This is a soft reminder for public users, not a hard gate.

### 7. Revenue Phase Transitions in Validate Decide

`validate_decide` now updates revenue phase milestones when issuing ADVANCE verdicts, if `revenue_phase` is set on the pipeline.

## Breaking Changes

**None.** All changes are additive.

- Existing v1.1.0 state files parse correctly — all new fields are optional
- All Zod schemas use `.passthrough()` so unknown fields are tolerated
- Existing tool registrations are unchanged
- No prerequisite changes for existing tools

## Migration Steps

1. Update: `npm update launch-engine-mcp` (or `npm install launch-engine-mcp@1.2.0`)
2. No state file migration needed — new fields are auto-populated when tools run
3. Optional: Run `portfolio_triage` to enable revenue phase tracking

## Enabling Revenue Phases

Revenue phases are opt-in. To enable:

1. Run `portfolio_triage` to select active pipelines
2. Selected pipelines automatically get `revenue_phase: "signal"`
3. Run `revenue_review` weekly to track progress through phases
4. Phase transitions are suggested by `revenue_review` and confirmed by user

Or manually set `revenue_phase` on any pipeline via `update_pipeline_state`.
