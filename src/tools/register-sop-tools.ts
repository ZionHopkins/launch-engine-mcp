import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DEPENDENCY_GRAPH } from "../deps/dependency-graph.js";
import { registerSopTool } from "./sop-tool-factory.js";

// SOP content imports
import {
  SCOUT, AUTONOMY, MARKET_INTEL, RESEARCH, BUILD_BLOCKS, STRESS_TEST, UNIT_ECONOMICS,
  NAME_LOCK, PLATFORM, PRODUCT, DEPLOY, QA, VALIDATE_PREP,
  VALIDATE_CHECK, VALIDATE_DECIDE, FEEDBACK,
  TRAFFIC_STRATEGY, CHANNELS, CREATIVE_TEST, FUNNEL_OPTIMIZE, SCALE, TRAFFIC_ANALYTICS,
  DREAM_100,
  PASSIVE_DEPLOY, PASSIVE_CHECK, PASSIVE_COMPOUND, PASSIVE_PORTFOLIO,
  RAPID_TEST, RAPID_CHECK, RAPID_GRADUATE, RAPID_STATUS,
  STATUS, DAILY_CHECK, LESSONS, VOICE_EXTRACT,
  CONTENT_ENGINE, CONTENT_REPURPOSE, SEO_CHECK, TOURNAMENT,
  BOLD_ACTION, PORTFOLIO_TRIAGE, REVENUE_REVIEW,
} from "../sops/content/index.js";

// Agent content imports
import {
  BOLD_ACTION_STRATEGIST,
  BUYER_RESEARCHER, CAMPAIGN_BUILDER, DREAM_100_RESEARCHER, MARKET_RESEARCHER,
  OFFER_ARCHITECT, OPTIMIZER, PASSIVE_ASSET_DEPLOYER, PERSONA_QA,
  PRODUCT_DESIGNER, RAPID_TESTER, TRAFFIC_AGENT, VOICE_EXTRACTION_ENGINE,
  CONTENT_STRATEGIST, SEO_AUDITOR,
} from "../sops/agents/index.js";

/** Map tool names to their SOP content string */
const SOP_CONTENT: Record<string, string> = {
  scout: SCOUT,
  autonomy: AUTONOMY,
  market_intel: MARKET_INTEL,
  research: RESEARCH,
  build_blocks: BUILD_BLOCKS,
  stress_test: STRESS_TEST,
  unit_economics: UNIT_ECONOMICS,
  name_lock: NAME_LOCK,
  platform: PLATFORM,
  product: PRODUCT,
  deploy: DEPLOY,
  qa: QA,
  validate_prep: VALIDATE_PREP,
  validate_check: VALIDATE_CHECK,
  validate_decide: VALIDATE_DECIDE,
  feedback: FEEDBACK,
  traffic_strategy: TRAFFIC_STRATEGY,
  channels: CHANNELS,
  creative_test: CREATIVE_TEST,
  funnel_optimize: FUNNEL_OPTIMIZE,
  scale: SCALE,
  traffic_analytics: TRAFFIC_ANALYTICS,
  dream_100: DREAM_100,
  passive_deploy: PASSIVE_DEPLOY,
  passive_check: PASSIVE_CHECK,
  passive_compound: PASSIVE_COMPOUND,
  passive_portfolio: PASSIVE_PORTFOLIO,
  rapid_test: RAPID_TEST,
  rapid_check: RAPID_CHECK,
  rapid_graduate: RAPID_GRADUATE,
  rapid_status: RAPID_STATUS,
  status: STATUS,
  daily_check: DAILY_CHECK,
  lessons: LESSONS,
  voice_extract: VOICE_EXTRACT,
  content_engine: CONTENT_ENGINE,
  content_repurpose: CONTENT_REPURPOSE,
  seo_check: SEO_CHECK,
  tournament: TOURNAMENT,
  bold_action: BOLD_ACTION,
  portfolio_triage: PORTFOLIO_TRIAGE,
  revenue_review: REVENUE_REVIEW,
};

/** Map subagent names to their instruction content */
const AGENT_CONTENT: Record<string, string> = {
  "market-researcher": MARKET_RESEARCHER,
  "buyer-researcher": BUYER_RESEARCHER,
  "offer-architect": OFFER_ARCHITECT,
  "product-designer": PRODUCT_DESIGNER,
  "campaign-builder": CAMPAIGN_BUILDER,
  "persona-qa": PERSONA_QA,
  "passive-asset-deployer": PASSIVE_ASSET_DEPLOYER,
  "voice-extraction-engine": VOICE_EXTRACTION_ENGINE,
  "optimizer": OPTIMIZER,
  "traffic-agent": TRAFFIC_AGENT,
  "dream-100-researcher": DREAM_100_RESEARCHER,
  "rapid-tester": RAPID_TESTER,
  "content-strategist": CONTENT_STRATEGIST,
  "seo-auditor": SEO_AUDITOR,
  "bold-action-strategist": BOLD_ACTION_STRATEGIST,
};

export function registerSopTools(server: McpServer): void {
  for (const [toolName, dep] of Object.entries(DEPENDENCY_GRAPH)) {
    const sopContent = SOP_CONTENT[toolName];
    if (!sopContent) {
      console.error(`Missing SOP content for tool: ${toolName}`);
      continue;
    }

    const agentContent = dep.subagent ? AGENT_CONTENT[dep.subagent] : undefined;

    registerSopTool(server, {
      dep,
      sopContent,
      agentContent,
    });
  }
}
