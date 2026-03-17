export const RAPID_GRADUATE = `# /rapid-graduate — Graduate Rapid Test to Full Pipeline

## What This Does

Graduates a successful rapid test into the full Business Execution OS pipeline. Credits the compressed research, carries forward winning data, and initializes the full pipeline at the appropriate stage.

## Trigger Context
After \`/rapid-check\` produces a GRADUATE verdict. User runs \`/rapid-graduate [market-slug]\`.

## Execution Protocol

### Step 1: Validate Graduation

Check \`pipeline-state.json\` → \`rapid_tests.[market-slug]\`:
- If slug doesn't exist: "No rapid test found for '[market-slug]'. Run /rapid-status to see your tests."
- If status is not "graduated": "This test hasn't received a GRADUATE verdict yet. Current status: [status]. Run /rapid-check with your final numbers first."
- If \`graduated_to\` is already set: "This test was already graduated on [date]. Full pipeline entry exists. Run /status to see it."

### Step 2: Extract Transferable Data

**From buyer snapshot** (\`assets/[market-slug]/rapid-test/buyer-snapshot.md\`):
- Target audience description
- Top 3 pains in buyer language
- Failed solutions
- The gap
- Promise
- Simple mechanism
- Price range validated
- Audience targeting data

**From ad copy and daily checks** (pipeline state):
- Which ad angle performed best (highest CTR): pain-first / failed-solution / promise-first / contrarian / social-proof
- Landing page conversion rate (clicks to conversions)
- Cost per click benchmarks
- Total conversions achieved
- Best-performing audience targeting details (if available from user's reports)

### Step 3: Determine Graduation Path

**Path A — Strong Signal (10+ conversions or any sale):**
Recommended path. Signal is clear, invest in depth.
- Skip: /scout, /autonomy, /market-intel
- Run: /research (expanded, with rapid test data as seed) → standard pipeline from /build-blocks

**Path B — Moderate Signal (graduated with 3-9 conversions):**
Signal exists but benefit from deeper research before committing to full build.
- Skip: /scout, /market-intel
- Run: /autonomy (quick check) → /research (expanded) → standard pipeline from /build-blocks

Present the recommendation and let the user confirm.

### Step 4: Create Full Pipeline Entry

Add to \`pipeline-state.json\` → \`pipelines\`:

\`\`\`json
{
  "[market-slug]": {
    "market_name": "[market-slug]",
    "created": "[today]",
    "updated": "[today]",
    "current_stage": "therapeutic_buyer",
    "graduated_from_rapid_test": true,
    "rapid_test_data": {
      "test_dates": "[start_date] to [end_date]",
      "total_spend": [X],
      "total_conversions": [X],
      "best_ctr": [X],
      "winning_ad_angle": "[angle name]",
      "landing_page_conversion_rate": [X],
      "cost_per_conversion": [X],
      "buyer_snapshot_file": "assets/[market-slug]/rapid-test/buyer-snapshot.md"
    },
    "autonomy_score": {
      "total": null,
      "classification": null,
      "dimensions": {},
      "flag": "Not yet scored — rapid test skipped autonomy. Run /autonomy if concerned about buildability."
    },
    "layer_1": {
      "scout": {
        "status": "complete",
        "completed_at": "[rapid test created date]",
        "output_file": "assets/[market-slug]/rapid-test/buyer-snapshot.md",
        "note": "Credited from rapid test. Paid traffic validated market demand — stronger signal than desk research."
      },
      "market_intelligence": {
        "status": "credited_from_rapid_test",
        "completed_at": "[rapid test end date]",
        "score": null,
        "output_file": null,
        "note": "Market viability confirmed by real ad spend: $[spend] produced [conversions] conversions. Full 120-point scoring available via /market-intel if needed before scaling."
      },
      "therapeutic_buyer": {
        "status": "needs_expansion",
        "completed_at": null,
        "personas_count": null,
        "primary_persona": null,
        "output_file": null,
        "note": "Buyer snapshot exists from rapid test (assets/[slug]/rapid-test/buyer-snapshot.md). Run /research to expand into full therapeutic buyer package. The snapshot will be passed as seed data."
      },
      "building_blocks": { "status": "pending", "completed_at": null, "output_file": null },
      "stress_test": { "status": "pending", "completed_at": null, "verdict": null, "score": null, "output_file": null },
      "unit_economics": {
        "status": "pending",
        "completed_at": null,
        "verdict": null,
        "product_price": null,
        "break_even_cpa": null,
        "target_cpa": null,
        "daily_budget": null,
        "days_to_statistical_confidence": null,
        "financial_guardrails": {},
        "output_file": null,
        "note": "Rapid test CPA data available as baseline: $[cost_per_conversion] per conversion at test scale."
      }
    },
    "layer_2": {
      "name_lock": { "status": "pending", "locked_at": null, "product_name": null, "mechanism_name": null, "system_name": null, "tagline": null, "domain": null, "social_handle": null, "revision_count": 0, "output_file": null },
      "platform_engine": { "status": "pending", "completed_at": null, "platform": null, "medium": null, "output_file": null },
      "product_architecture": { "status": "pending", "completed_at": null, "modules_count": null, "agent_built_pct": null, "output_file": null },
      "copy_structure": { "status": "pending", "completed_at": null, "assets": [], "output_file": null },
      "campaign_deployment": { "status": "pending", "completed_at": null, "assets": [], "output_file": null },
      "qa_gate": { "status": "pending", "completed_at": null, "verdict": null, "overall_score": null, "checks": {}, "corrections_applied": {}, "assets_cleared": [], "output_file": null }
    },
    "layer_3": {
      "validation_tier_1": {
        "status": "credited_from_rapid_test",
        "completed_at": "[rapid test end date]",
        "verdict": "ADVANCE",
        "deployment_package": "assets/[market-slug]/rapid-test/",
        "validation_window": { "start": "[start]", "end": "[end]", "days": [duration] },
        "thresholds": {},
        "daily_checks": [],
        "aggregate_metrics": {
          "total_spend": [rapid_test_spend],
          "total_clicks": [rapid_test_clicks],
          "total_signups": [rapid_test_conversions],
          "total_conversions": null,
          "final_cpa": [rapid_test_cpa],
          "final_ctr": [rapid_test_ctr]
        },
        "signals": {},
        "output_file": null,
        "note": "Tier 1 signal validation completed via rapid test. Demand confirmed."
      },
      "validation_tier_2": { "status": "pending", "completed_at": null, "verdict": null, "deployment_package": null, "validation_window": {}, "thresholds": {}, "daily_checks": [], "aggregate_metrics": {}, "signals": {}, "output_file": null },
      "validation_tier_3": { "status": "pending", "completed_at": null, "verdict": null, "deployment_package": null, "validation_window": {}, "thresholds": {}, "daily_checks": [], "aggregate_metrics": {}, "signals": {}, "output_file": null },
      "iteration_history": []
    },
    "traffic_agent": {
      "traffic_strategy": { "status": "pending", "channels_selected": [], "budget_allocation": {}, "output_file": null },
      "channel_deployment": { "status": "pending", "channels_live": [], "output_files": [] },
      "creative_testing": { "status": "pending", "batches_tested": 0, "active_winners": [], "killed": [], "fatiguing": [], "output_files": [] },
      "funnel_optimization": { "status": "pending", "tests_run": 0, "current_bottleneck": null, "conversion_chain": {}, "output_files": [] },
      "scale_protocol": { "status": "pending", "readiness_met": false, "output_file": null },
      "traffic_performance": { "total_spend": 0, "total_revenue": 0, "roas": null, "cpa": null }
    },
    "daily_operations": { "daily_checks": [], "weekly_summaries": [], "last_check_date": null },
    "passive_portfolio": { "status": "not_started", "phases": {}, "asset_tracking": [], "portfolio_metrics": {}, "quarterly_reviews": [], "output_files": [] },
    "decisions": [
      {
        "date": "[today]",
        "type": "graduation",
        "details": "Graduated from rapid test. Signal: [key metric]. Path: [A or B]."
      }
    ],
    "notes": ["Graduated from rapid test on [today]. Rapid test data in assets/[slug]/rapid-test/."],
    "voice_extraction": { "status": "not_started", "business_slug": null, "extraction_cycle": 0, "accumulated_count": 0, "threshold": 20, "patterns": {}, "voice_doc_path": null, "voice_state_path": null, "quarterly_reviews": [] }
  }
}
\`\`\`

### Step 5: Update Rapid Test Entry

In \`pipeline-state.json\` → \`rapid_tests.[market-slug]\`:
- Set \`graduated_to\` to \`"[market-slug]"\` (the pipelines key)
- Set \`graduation_date\` to today

### Step 6: Create Research Seed File

Create \`assets/[market-slug]/research/rapid-test-seed.md\` with compiled data from the rapid test to feed into the full \`/research\` command:

\`\`\`
RAPID TEST SEED DATA — [Market/Idea]
Source: Rapid test conducted [dates], $[spend] spent, [conversions] conversions

This file is seed data for the full Therapeutic Buyer Engine (/research).
Use these confirmed findings as starting points — expand and deepen, don't start from scratch.

CONFIRMED PAINS (real people clicked/converted on these):
[top pains from buyer snapshot, annotated with which ad angles performed]

CONFIRMED LANGUAGE:
[language that worked in ads — the winning ad's primary text hooks]

WINNING ANGLE: [angle name] — [why it likely worked based on data]
LOSING ANGLES: [angles that underperformed — avoid these framings]

PRICE SENSITIVITY:
[price range from snapshot + any conversion data at price point]

AUDIENCE THAT RESPONDED:
[targeting details + any audience insights from Meta]

GAPS TO FILL WITH FULL RESEARCH:
- Full pain architecture (only have top 3, need 5-7 with root vs. surface distinction)
- Complete failed solutions map (only have summary, need detailed map)
- Identity gap analysis (not yet done)
- Full language bank (only have 5-8 phrases, need 20-30)
- Sophistication and awareness level scoring
- Transformation narrative
- Complete customer avatar
\`\`\`

### Step 7: Present Summary

\`\`\`
GRADUATED: [Idea Name] → Full Pipeline
═══════════════════════════════════════

Rapid test data credited:
  Scout: CREDITED (demand confirmed via $[spend] ad spend)
  Market Intel: CREDITED (viability proven by [conversions] conversions)
  Tier 1 Validation: CREDITED ([key metric] exceeded threshold)
  Buyer Snapshot: SEEDED (will expand via /research)

Data advantages you now have:
  - Winning ad angle: [angle] ([CTR]% CTR)
  - Real CPA baseline: $[cost_per_conversion]
  - Landing page conversion rate: [X]%
  - Confirmed buyer language that drives clicks

Full pipeline initialized. Recommended next step:

  /research [market-slug]
    Expands your buyer snapshot into full therapeutic buyer research.
    Your rapid test findings are pre-loaded as seed data.
    Estimated: ~15 min (subagent runs 25-35 searches, starting from your confirmed data)

  Then: /build-blocks → /stress-test → /unit-economics → build → deploy → validate

Time saved vs. starting fresh: ~1-2 hours (scout + market-intel + Tier 1 validation skipped)
Data advantage: You have REAL conversion data, not estimates.
\`\`\`

## Autonomy
Tier 2 — Notify & Proceed. The data justified graduation; this is a mechanical state transfer.

## Output
Full pipeline entry in pipeline-state.json. Research seed file created. Rapid test entry updated. Summary presented inline.

## Next Step
\`/research [market-slug]\` — expand buyer snapshot into full therapeutic buyer package, then standard pipeline flow.`;
