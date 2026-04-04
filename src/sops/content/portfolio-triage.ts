export const PORTFOLIO_TRIAGE = `
# Portfolio Triage — Pipeline Ranking & Selection Gate

## What This Does
Ranks all pipelines past unit-economics by **Profit Velocity Score** and recommends your top N for active focus. This helps you concentrate resources on the pipelines most likely to generate revenue fastest.

## Trigger Context
Run when multiple pipelines have passed unit-economics with VIABLE or TIGHT verdict and you want to prioritize.

## Execution Protocol

### Step 1: Collect Eligible Pipelines (Tier 1 — Auto)
Read pipeline-state.json. For each pipeline, check:
- unit_economics.status == "complete"
- unit_economics.verdict in ["VIABLE", "TIGHT"]

If fewer than 2 eligible pipelines exist, report all eligible. If 0 eligible: "No pipelines past unit-economics. Run scout -> unit-economics first."

### Step 2: Compute Profit Velocity Score (Tier 1 — Auto)
For each eligible pipeline, calculate:

profit_velocity = LTV / sales_cycle_estimate_days
  (default sales_cycle_estimate_days to 30 if null)

autonomy_factor = autonomy_score.total / 35
  (normalized 0-1; default to 0.7 if no autonomy score)

market_depth = stress_test.score / 50
  (normalized 0-1; default to 0.5 if no stress test score)

triage_score = profit_velocity x autonomy_factor x market_depth

Score interpretation:
- Higher = faster path to revenue with more agent leverage
- LTV drives the numerator — high-ticket offers score higher
- Short sales cycles amplify the score
- Autonomy and market depth are multipliers reducing execution risk

### Step 3: Rank and Present (Tier 1 — Auto)
Present a ranked table showing:
- Rank number
- Pipeline name
- LTV
- Sales cycle estimate (days)
- Autonomy score
- Stress test score
- Triage score

### Step 4: Recommend Selection (Tier 3 — Recommend & Wait)
Recommend top N pipelines (N = max_active parameter, default 3) for active focus.

Present recommendation with reasoning. Suggest archiving remainder — research preserved, can reactivate anytime.

Wait for user to confirm or override selection.

### Step 5: Update Pipeline State (Tier 1 — Auto)
For selected pipelines:
- Set triage_status: "selected"
- Set revenue_phase: "signal" (if not already set and revenue tracking is desired)
- Set triage_rank and triage_score

For archived pipelines:
- Set triage_status: "archived"
- Set triage_rank and triage_score
- Preserve all other fields — research and assets are kept

If selected pipelines have completed validate_prep and deployment_deadline_at is null:
- Optionally set deployment_deadline_at to suggest a deployment timeline

Update pipeline-state.json.

### Step 6: Present Action Plan
Show selected pipelines with their specific next steps based on current_stage.
Show archived pipelines with their rank and score.
Note: Run revenue_review weekly to track progress. Run portfolio_triage again when a slot opens.

## Re-Triage Rules
- Can be re-run at any time
- Archiving a selected pipeline opens a slot
- revenue_review can recommend archiving if no progress
- Archived pipelines retain all research — reactivation is instant

## Output
No separate file. State changes written directly to pipeline-state.json.
`;
