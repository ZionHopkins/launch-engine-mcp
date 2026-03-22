/**
 * Full prerequisite map for all 39 SOP tools.
 *
 * Each entry defines:
 *  - prerequisites: stages that must be "complete" (or specific verdict) before this tool runs
 *  - layer: which section of pipeline-state.json this tool reads/writes
 *  - stateKey: the key within that layer (for status lookups)
 *  - isPipelineTool: false for rapid-test tools that use rapid_tests key
 *  - isReadOnly: true for status/read-only tools
 *  - learningsCategories: which learnings categories to check before running
 */

export interface Prerequisite {
  /** Dot-path into pipeline state, e.g. "layer_1.scout.status" */
  path: string;
  /** Required value — defaults to "complete" */
  value?: string;
  /** Human-readable stage name */
  label: string;
}

export interface ToolDependency {
  name: string;
  description: string;
  prerequisites: Prerequisite[];
  layer: "layer_1" | "layer_2" | "layer_3" | "traffic" | "passive" | "rapid" | "cross_cutting" | "organic";
  stateKey: string;
  isPipelineTool: boolean;
  isReadOnly: boolean;
  isEntryPoint: boolean;
  learningsCategories: string[];
  subagent?: string;
}

export const DEPENDENCY_GRAPH: Record<string, ToolDependency> = {
  // ═══════════════════════════════════════════════
  // LAYER 1: STRATEGIST
  // ═══════════════════════════════════════════════
  scout: {
    name: "scout",
    description: "Preliminary market scanning. Takes a raw idea and determines if it's worth deeper investigation.",
    prerequisites: [],
    layer: "layer_1",
    stateKey: "layer_1.scout",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: true,
    learningsCategories: ["market_selection"],
  },

  autonomy: {
    name: "autonomy",
    description: "Agent Autonomy Score — scores a market across 7 dimensions for AI-buildable product viability.",
    prerequisites: [
      { path: "layer_1.scout.status", value: "complete", label: "Scout" },
    ],
    layer: "layer_1",
    stateKey: "autonomy_score",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  market_intel: {
    name: "market_intel",
    description: "Market Intelligence OS — deep market research with competitive analysis and scoring.",
    prerequisites: [
      { path: "layer_1.scout.status", value: "complete", label: "Scout" },
      { path: "autonomy_score.classification", label: "Autonomy Score" },
    ],
    layer: "layer_1",
    stateKey: "layer_1.market_intelligence",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["market_selection"],
    subagent: "market-researcher",
  },

  research: {
    name: "research",
    description: "Therapeutic Buyer Engine — deep buyer persona research with 25-35 web searches.",
    prerequisites: [
      { path: "layer_1.scout.status", value: "complete", label: "Scout" },
      { path: "autonomy_score.classification", label: "Autonomy Score" },
      { path: "layer_1.market_intelligence.status", value: "complete", label: "Market Intelligence" },
    ],
    layer: "layer_1",
    stateKey: "layer_1.therapeutic_buyer",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
    subagent: "buyer-researcher",
  },

  build_blocks: {
    name: "build_blocks",
    description: "3-Part Promotion Invention — builds the 7 Building Blocks from buyer research.",
    prerequisites: [
      { path: "layer_1.therapeutic_buyer.status", value: "complete", label: "Therapeutic Buyer Research" },
    ],
    layer: "layer_1",
    stateKey: "layer_1.building_blocks",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["offer_design"],
    subagent: "offer-architect",
  },

  stress_test: {
    name: "stress_test",
    description: "Offer Stress Test — scores the offer across 10 dimensions, returns GO/REVISE/REBUILD.",
    prerequisites: [
      { path: "layer_1.building_blocks.status", value: "complete", label: "Building Blocks" },
    ],
    layer: "layer_1",
    stateKey: "layer_1.stress_test",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["offer_design"],
    subagent: "offer-architect",
  },

  unit_economics: {
    name: "unit_economics",
    description: "Unit Economics Gate — models CPA, LTV, break-even, and budget requirements.",
    prerequisites: [
      { path: "layer_1.stress_test.status", value: "complete", label: "Stress Test" },
    ],
    layer: "layer_1",
    stateKey: "layer_1.unit_economics",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["offer_design"],
  },

  // ═══════════════════════════════════════════════
  // LAYER 2: BUILDER
  // ═══════════════════════════════════════════════
  name_lock: {
    name: "name_lock",
    description: "Name Lock Gate — locks the business/product name before any assets are built.",
    prerequisites: [
      { path: "layer_1.stress_test.status", value: "complete", label: "Stress Test" },
      { path: "layer_1.unit_economics.status", value: "complete", label: "Unit Economics" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.name_lock",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  platform: {
    name: "platform",
    description: "Platform Engine — scores and selects the tech stack for product delivery.",
    prerequisites: [
      { path: "layer_1.stress_test.status", value: "complete", label: "Stress Test" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.platform",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["product"],
  },

  product: {
    name: "product",
    description: "Product Architecture Engine — designs the product/service delivery structure.",
    prerequisites: [
      { path: "layer_1.stress_test.status", value: "complete", label: "Stress Test" },
      { path: "layer_2.name_lock.status", value: "complete", label: "Name Lock" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.product",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["product"],
    subagent: "product-designer",
  },

  deploy: {
    name: "deploy",
    description: "Campaign Deployment Engine — generates sales pages, email sequences, and ad copy.",
    prerequisites: [
      { path: "layer_2.name_lock.status", value: "complete", label: "Name Lock" },
      { path: "layer_2.platform.status", value: "complete", label: "Platform" },
      { path: "layer_2.product.status", value: "complete", label: "Product Architecture" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.deploy",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["creative"],
    subagent: "campaign-builder",
  },

  qa: {
    name: "qa",
    description: "Persona Alignment Gate — 7-check QA ensuring all copy aligns with buyer persona.",
    prerequisites: [
      { path: "layer_2.deploy.status", value: "complete", label: "Campaign Deployment" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.qa",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["creative"],
    subagent: "persona-qa",
  },

  validate_prep: {
    name: "validate_prep",
    description: "Validation Deployment Package — generates the deployment checklist for real-world testing.",
    prerequisites: [
      { path: "layer_2.deploy.status", value: "complete", label: "Campaign Deployment" },
      { path: "layer_2.qa.status", value: "complete", label: "QA Gate" },
    ],
    layer: "layer_2",
    stateKey: "layer_2.validate_prep",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  // ═══════════════════════════════════════════════
  // LAYER 3: VALIDATOR / OPTIMIZER
  // ═══════════════════════════════════════════════
  validate_check: {
    name: "validate_check",
    description: "Daily 60-Second Health Check — quick metrics review during validation window.",
    prerequisites: [
      { path: "layer_2.validate_prep.status", value: "complete", label: "Validation Prep" },
    ],
    layer: "layer_3",
    stateKey: "layer_3.validate_check",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  validate_decide: {
    name: "validate_decide",
    description: "Validation Verdict Engine — end-of-window decision: ADVANCE, ITERATE, or KILL.",
    prerequisites: [
      { path: "layer_2.validate_prep.status", value: "complete", label: "Validation Prep" },
    ],
    layer: "layer_3",
    stateKey: "layer_3.validate_decide",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  feedback: {
    name: "feedback",
    description: "Optimizer Feedback Loop — diagnoses performance issues and routes fixes.",
    prerequisites: [
      { path: "layer_2.deploy.status", value: "complete", label: "Campaign Deployment" },
    ],
    layer: "layer_3",
    stateKey: "layer_3.feedback",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["funnel", "traffic", "creative"],
    subagent: "optimizer",
  },

  // ═══════════════════════════════════════════════
  // TRAFFIC AGENT
  // ═══════════════════════════════════════════════
  traffic_strategy: {
    name: "traffic_strategy",
    description: "Traffic Strategy Engine — researches and scores traffic channels.",
    prerequisites: [
      { path: "layer_2.deploy.status", value: "complete", label: "Campaign Deployment" },
    ],
    layer: "traffic",
    stateKey: "traffic.traffic_strategy",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["traffic"],
    subagent: "traffic-agent",
  },

  channels: {
    name: "channels",
    description: "Channel Deployment Engine — sets up and configures selected traffic channels.",
    prerequisites: [
      { path: "traffic.traffic_strategy.status", value: "complete", label: "Traffic Strategy" },
    ],
    layer: "traffic",
    stateKey: "traffic.channels",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["traffic"],
    subagent: "traffic-agent",
  },

  creative_test: {
    name: "creative_test",
    description: "Creative Testing Protocol — generates and manages ad creative variations.",
    prerequisites: [
      { path: "traffic.channels.status", value: "complete", label: "Channel Deployment" },
    ],
    layer: "traffic",
    stateKey: "traffic.creative_test",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["creative"],
  },

  funnel_optimize: {
    name: "funnel_optimize",
    description: "Funnel Optimization Engine — CRO testing across the conversion funnel.",
    prerequisites: [
      { path: "traffic.channels.status", value: "complete", label: "Channel Deployment" },
    ],
    layer: "traffic",
    stateKey: "traffic.funnel_optimize",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["funnel"],
  },

  scale: {
    name: "scale",
    description: "Scale Protocol — systematic scaling of validated traffic channels.",
    prerequisites: [
      { path: "traffic.creative_test.status", value: "complete", label: "Creative Testing" },
    ],
    layer: "traffic",
    stateKey: "traffic.scale",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["scaling"],
  },

  traffic_analytics: {
    name: "traffic_analytics",
    description: "Traffic Analytics & Attribution — performance reporting and attribution.",
    prerequisites: [
      { path: "traffic.channels.status", value: "complete", label: "Channel Deployment" },
    ],
    layer: "traffic",
    stateKey: "traffic.traffic_analytics",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["traffic"],
  },

  dream_100: {
    name: "dream_100",
    description: "Dream 100 Relationship Strategy — entity discovery and outreach sequences.",
    prerequisites: [
      { path: "layer_1.therapeutic_buyer.status", value: "complete", label: "Therapeutic Buyer Research" },
    ],
    layer: "traffic",
    stateKey: "dream_100",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["distribution", "relationship_marketing"],
    subagent: "dream-100-researcher",
  },

  // ═══════════════════════════════════════════════
  // PASSIVE PIPELINE
  // ═══════════════════════════════════════════════
  passive_deploy: {
    name: "passive_deploy",
    description: "Passive Asset Deployment Agent (PADA) — marketplace asset scoring and build specs.",
    prerequisites: [
      { path: "layer_1.therapeutic_buyer.status", value: "complete", label: "Therapeutic Buyer Research" },
    ],
    layer: "passive",
    stateKey: "passive",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["market_selection", "product"],
    subagent: "passive-asset-deployer",
  },

  passive_check: {
    name: "passive_check",
    description: "Passive Asset Validation Check — scheduled performance checks at Day 14/30/45/60/90.",
    prerequisites: [
      { path: "passive.status", label: "Passive Deploy" },
    ],
    layer: "passive",
    stateKey: "passive",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  passive_compound: {
    name: "passive_compound",
    description: "Anchor Compounding Engine — deploys related assets around proven anchors.",
    prerequisites: [
      { path: "passive.status", label: "Passive Deploy" },
    ],
    layer: "passive",
    stateKey: "passive",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["product"],
  },

  passive_portfolio: {
    name: "passive_portfolio",
    description: "Portfolio Feedback Report — quarterly review of all passive assets.",
    prerequisites: [
      { path: "passive.status", label: "Passive Deploy" },
    ],
    layer: "passive",
    stateKey: "passive",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  // ═══════════════════════════════════════════════
  // RAPID TEST LAYER
  // ═══════════════════════════════════════════════
  rapid_test: {
    name: "rapid_test",
    description: "Rapid Idea Test — compressed research + landing page + ads in a single pass.",
    prerequisites: [],
    layer: "rapid",
    stateKey: "rapid_tests",
    isPipelineTool: false,
    isReadOnly: false,
    isEntryPoint: true,
    learningsCategories: ["market_selection", "creative"],
    subagent: "rapid-tester",
  },

  rapid_check: {
    name: "rapid_check",
    description: "Rapid Test Daily Check — reviews metrics against decision thresholds.",
    prerequisites: [],
    layer: "rapid",
    stateKey: "rapid_tests",
    isPipelineTool: false,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  rapid_graduate: {
    name: "rapid_graduate",
    description: "Graduate Rapid Test to Full Pipeline — creates pipeline entry from rapid test data.",
    prerequisites: [],
    layer: "rapid",
    stateKey: "rapid_tests",
    isPipelineTool: false,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  rapid_status: {
    name: "rapid_status",
    description: "Rapid Test Portfolio Status — dashboard of all active/graduated/killed rapid tests.",
    prerequisites: [],
    layer: "rapid",
    stateKey: "rapid_tests",
    isPipelineTool: false,
    isReadOnly: true,
    isEntryPoint: false,
    learningsCategories: [],
  },

  // ═══════════════════════════════════════════════
  // ORGANIC GROWTH ENGINE
  // ═══════════════════════════════════════════════
  content_engine: {
    name: "content_engine",
    description: "Organic Content & SEO/GEO Engine — topic cluster research, pillar/spoke content generation, schema markup, AI visibility baselines.",
    prerequisites: [
      { path: "layer_2.qa.status", value: "complete", label: "QA Gate" },
      { path: "layer_2.validate_prep.status", value: "complete", label: "Validation Prep" },
    ],
    layer: "organic",
    stateKey: "organic_growth.content_engine",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["seo", "content", "organic", "geo"],
    subagent: "content-strategist",
  },

  content_repurpose: {
    name: "content_repurpose",
    description: "Single-Pass Content Repurposing — takes one pillar page and generates 7+ platform-native assets (YouTube, short-form, Reddit, LinkedIn, newsletters, social).",
    prerequisites: [
      { path: "organic_growth.content_engine.status", value: "complete", label: "Content Engine" },
    ],
    layer: "organic",
    stateKey: "organic_growth.content_repurpose",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["content", "distribution"],
    subagent: "content-strategist",
  },

  seo_check: {
    name: "seo_check",
    description: "Monthly SEO/GEO Audit — content health, AI citation tracking, competitive gaps, technical SEO, content freshness scoring.",
    prerequisites: [
      { path: "organic_growth.content_engine.status", value: "complete", label: "Content Engine" },
    ],
    layer: "organic",
    stateKey: "organic_growth.seo_check",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: ["seo", "content_decay", "ai_visibility"],
    subagent: "seo-auditor",
  },

  tournament: {
    name: "tournament",
    description: "Parallel Portfolio Tournament — batch-evaluates 3-5 business ideas through Layer 1 simultaneously with comparison gates. ~50-60% faster than sequential scout runs.",
    prerequisites: [],
    layer: "layer_1",
    stateKey: "tournament",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: true,
    learningsCategories: ["market_selection"],
  },

  // ═══════════════════════════════════════════════
  // CROSS-CUTTING
  // ═══════════════════════════════════════════════
  status: {
    name: "status",
    description: "Pipeline Status Report — shows current pipeline stage, completed steps, and next actions.",
    prerequisites: [],
    layer: "cross_cutting",
    stateKey: "",
    isPipelineTool: false,
    isReadOnly: true,
    isEntryPoint: true,
    learningsCategories: [],
  },

  daily_check: {
    name: "daily_check",
    description: "Daily Operations Pulse — 5-minute daily check for any stage with live campaigns.",
    prerequisites: [],
    layer: "cross_cutting",
    stateKey: "",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
  },

  lessons: {
    name: "lessons",
    description: "Pattern Library & Learnings Engine — capture and retrieve patterns across pipelines.",
    prerequisites: [],
    layer: "cross_cutting",
    stateKey: "",
    isPipelineTool: false,
    isReadOnly: false,
    isEntryPoint: true,
    learningsCategories: [],
  },

  voice_extract: {
    name: "voice_extract",
    description: "Brand Voice Extraction — generates brand voice calibration docs from QA-passed content.",
    prerequisites: [
      { path: "layer_2.qa.status", value: "complete", label: "QA Gate" },
    ],
    layer: "cross_cutting",
    stateKey: "voice",
    isPipelineTool: true,
    isReadOnly: false,
    isEntryPoint: false,
    learningsCategories: [],
    subagent: "voice-extraction-engine",
  },
};

export function getToolDependency(toolName: string): ToolDependency | undefined {
  return DEPENDENCY_GRAPH[toolName];
}

export function getAllToolNames(): string[] {
  return Object.keys(DEPENDENCY_GRAPH);
}
