import type { PipelineState } from "../types/pipeline-state.js";
import type { Learnings } from "../types/learnings.js";

export function emptyPipelineState(): PipelineState {
  return {
    version: "3.0",
    active_pipeline: null,
    pipelines: {},
    rapid_tests: {},
  };
}

export function emptyLearnings(): Learnings {
  return {
    version: "1.0",
    learnings: [],
  };
}

export function newPipelineEntry(marketName: string): Record<string, unknown> {
  const today = new Date().toISOString().split("T")[0];
  return {
    market_name: marketName,
    created: today,
    updated: today,
    current_stage: "scout",
    autonomy_score: null,
    layer_1: {
      scout: { status: "not_started" },
      market_intelligence: { status: "not_started" },
      therapeutic_buyer: { status: "not_started" },
      building_blocks: { status: "not_started" },
      stress_test: { status: "not_started" },
      unit_economics: { status: "not_started" },
    },
    layer_2: {
      name_lock: { status: "not_started" },
      platform: { status: "not_started" },
      product: { status: "not_started" },
      deploy: { status: "not_started" },
      qa: { status: "not_started" },
      validate_prep: { status: "not_started" },
    },
    layer_3: {
      validate_check: { status: "not_started" },
      validate_decide: { status: "not_started" },
      feedback: { status: "not_started" },
    },
    traffic: {
      traffic_strategy: { status: "not_started" },
      channels: { status: "not_started" },
      creative_test: { status: "not_started" },
      funnel_optimize: { status: "not_started" },
      scale: { status: "not_started" },
      traffic_analytics: { status: "not_started" },
    },
    dream_100: { status: "not_started" },
    passive: {},
    voice: {},
  };
}

export function newRapidTestEntry(
  idea: string,
  slug: string,
  budget: number = 75,
  durationDays: number = 5,
  offerType: string = "email_capture",
  pricePoint: number | null = null,
): Record<string, unknown> {
  const today = new Date().toISOString().split("T")[0];
  const dailyBudget = Math.round((budget / durationDays) * 100) / 100;
  return {
    idea,
    market_slug: slug,
    created: today,
    status: "ready_to_deploy",
    test_parameters: {
      budget,
      daily_budget: dailyBudget,
      duration_days: durationDays,
      offer_type: offerType,
      price_point: pricePoint,
    },
    thresholds: {
      graduate: {
        min_conversions: offerType === "email_capture" ? 10 : 1,
        max_cost_per_conversion: offerType === "email_capture" ? budget / 10 : budget,
        min_ctr: 1.5,
        min_landing_page_conversion: offerType === "email_capture" ? 15 : 5,
      },
      continue: {
        min_conversions: offerType === "email_capture" ? 3 : 0,
        max_cost_per_conversion: offerType === "email_capture" ? budget / 5 : budget,
        min_ctr: 0.8,
      },
      kill: {
        max_spend_zero_conversions: Math.round(budget * 0.67),
        min_ctr_after_1000_impressions: 0.8,
      },
    },
    deployment: {
      landing_page_url: null,
      campaign_live: false,
      start_date: null,
      end_date: null,
    },
    daily_checks: [],
    aggregate_metrics: {
      total_spend: 0,
      total_impressions: 0,
      total_clicks: 0,
      total_conversions: 0,
      ctr: null,
      cpc: null,
      cpa: null,
      conversion_rate: null,
    },
    verdict: null,
    graduated_to: null,
    output_files: [
      `assets/${slug}/rapid-test/buyer-snapshot.md`,
      `assets/${slug}/rapid-test/landing-page.html`,
      `assets/${slug}/rapid-test/ad-copy.md`,
      `assets/${slug}/rapid-test/deployment-checklist.md`,
      `assets/${slug}/rapid-test/decision-thresholds.md`,
    ],
  };
}
