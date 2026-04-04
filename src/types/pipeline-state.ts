import { z } from "zod";

export const StageStatusSchema = z.enum(["not_started", "in_progress", "complete", "blocked"]);

export const StageEntrySchema = z.object({
  status: StageStatusSchema,
  completed_at: z.string().nullable().optional(),
  output_file: z.string().nullable().optional(),
}).passthrough();

export const AutonomyScoreSchema = z.object({
  total: z.number(),
  classification: z.enum(["HIGH", "MODERATE", "LOW"]),
  dimensions: z.record(z.number()).optional(),
  flag: z.string().nullable().optional(),
}).passthrough();

export const Layer1Schema = z.object({
  scout: StageEntrySchema.optional(),
  market_intelligence: StageEntrySchema.optional(),
  therapeutic_buyer: StageEntrySchema.optional(),
  building_blocks: StageEntrySchema.optional(),
  stress_test: StageEntrySchema.optional(),
  unit_economics: StageEntrySchema.optional(),
}).passthrough();

export const Layer2Schema = z.object({
  name_lock: StageEntrySchema.optional(),
  platform: StageEntrySchema.optional(),
  product: StageEntrySchema.optional(),
  deploy: StageEntrySchema.optional(),
  qa: StageEntrySchema.optional(),
  validate_prep: StageEntrySchema.optional(),
}).passthrough();

export const Layer3Schema = z.object({
  validate_check: StageEntrySchema.optional(),
  validate_decide: StageEntrySchema.optional(),
  feedback: StageEntrySchema.optional(),
}).passthrough();

export const TrafficSchema = z.object({
  traffic_strategy: StageEntrySchema.optional(),
  channels: StageEntrySchema.optional(),
  creative_test: StageEntrySchema.optional(),
  funnel_optimize: StageEntrySchema.optional(),
  scale: StageEntrySchema.optional(),
  traffic_analytics: StageEntrySchema.optional(),
}).passthrough();

export const RevenuePhaseGateSchema = z.object({
  status: z.string().default("not_started"),
  evidence: z.string().nullable().optional(),
  achieved_at: z.string().nullable().optional(),
}).passthrough();

export const RevenueMilestonesSchema = z.object({
  signal_achieved_at: z.string().nullable().optional(),
  first_sale_at: z.string().nullable().optional(),
  first_sale_amount: z.number().nullable().optional(),
  third_sale_at: z.string().nullable().optional(),
  ten_k_mrr_at: z.string().nullable().optional(),
}).passthrough();

export const PipelineEntrySchema = z.object({
  market_name: z.string(),
  created: z.string(),
  updated: z.string(),
  current_stage: z.string(),
  autonomy_score: AutonomyScoreSchema.nullable().optional(),
  layer_1: Layer1Schema.optional(),
  layer_2: Layer2Schema.optional(),
  layer_3: Layer3Schema.optional(),
  traffic: TrafficSchema.optional(),
  dream_100: StageEntrySchema.optional(),
  passive: z.record(z.unknown()).optional(),
  voice: z.record(z.unknown()).optional(),
  // Revenue Phase System (v1.2.0 — optional overlay)
  revenue_phase: z.enum(["signal", "cash", "repeat", "scale", "archived"]).nullable().optional(),
  revenue_phase_gates: z.object({
    signal: RevenuePhaseGateSchema.optional(),
    cash: RevenuePhaseGateSchema.optional(),
    repeat: RevenuePhaseGateSchema.optional(),
    scale: RevenuePhaseGateSchema.optional(),
  }).passthrough().nullable().optional(),
  revenue_milestones: RevenueMilestonesSchema.nullable().optional(),
  first_revenue_date: z.string().nullable().optional(),
  days_to_first_sale: z.number().nullable().optional(),
  // Portfolio Management (v1.2.0)
  triage_status: z.enum(["selected", "archived", "pending_triage"]).nullable().optional(),
  triage_rank: z.number().nullable().optional(),
  triage_score: z.number().nullable().optional(),
  deployment_deadline_at: z.string().nullable().optional(),
  deployment_initiated_at: z.string().nullable().optional(),
}).passthrough();

export const RapidTestEntrySchema = z.object({
  idea: z.string(),
  market_slug: z.string(),
  created: z.string(),
  status: z.string(),
  test_parameters: z.object({
    budget: z.number(),
    daily_budget: z.number(),
    duration_days: z.number(),
    offer_type: z.string(),
    price_point: z.number().nullable().optional(),
  }).passthrough(),
  thresholds: z.record(z.unknown()).optional(),
  deployment: z.record(z.unknown()).optional(),
  daily_checks: z.array(z.unknown()).optional(),
  aggregate_metrics: z.record(z.unknown()).optional(),
  verdict: z.string().nullable().optional(),
  graduated_to: z.string().nullable().optional(),
  output_files: z.array(z.string()).optional(),
}).passthrough();

export const PipelineStateSchema = z.object({
  version: z.string().default("3.1"),
  active_pipeline: z.string().nullable().default(null),
  pipelines: z.record(PipelineEntrySchema).default({}),
  rapid_tests: z.record(RapidTestEntrySchema).default({}),
}).passthrough();

export type StageStatus = z.infer<typeof StageStatusSchema>;
export type StageEntry = z.infer<typeof StageEntrySchema>;
export type PipelineEntry = z.infer<typeof PipelineEntrySchema>;
export type RapidTestEntry = z.infer<typeof RapidTestEntrySchema>;
export type PipelineState = z.infer<typeof PipelineStateSchema>;
