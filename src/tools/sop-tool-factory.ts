import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolDependency } from "../deps/dependency-graph.js";
import { readPipelineState } from "../state/pipeline-manager.js";
import { checkPrerequisites, formatBlockedMessage } from "../deps/prerequisite-checker.js";
import { loadUpstreamContext } from "../context/context-loader.js";
import { matchLearnings } from "../context/learnings-matcher.js";

export interface SopToolConfig {
  dep: ToolDependency;
  sopContent: string;
  agentContent?: string;
}

/**
 * Register a single SOP tool on the MCP server.
 *
 * Each SOP tool:
 * 1. Validates prerequisites against pipeline-state.json
 * 2. Loads upstream context from previous stage outputs
 * 3. Checks learnings.json for relevant patterns
 * 4. Returns the full SOP instructions enriched with context
 */
export function registerSopTool(server: McpServer, config: SopToolConfig): void {
  const { dep, sopContent, agentContent } = config;

  // Build input schema based on whether this is an entry point
  const inputSchema: Record<string, any> = {};

  if (dep.isEntryPoint && dep.name === "scout") {
    inputSchema.idea = z.string().describe("The market idea, niche, or problem to explore");
    inputSchema.market_name = z.string().optional().describe("URL-safe market slug (auto-generated from idea if omitted)");
  } else if (dep.isEntryPoint && dep.name === "rapid_test") {
    inputSchema.idea = z.string().describe("The business idea to test");
    inputSchema.budget = z.number().optional().describe("Test budget in dollars (default: 75)");
    inputSchema.duration_days = z.number().optional().describe("Test duration in days (default: 5)");
  } else if (dep.isEntryPoint && dep.name === "lessons") {
    inputSchema.mode = z.enum(["capture", "retrieve"]).describe("capture: save a new learning | retrieve: search existing learnings");
    inputSchema.category = z.string().optional().describe("Learning category to filter by");
    inputSchema.tags = z.array(z.string()).optional().describe("Tags to search for");
    inputSchema.market_name = z.string().optional().describe("Pipeline name for context");
  } else if (dep.isEntryPoint && (dep.name === "status" || dep.name === "rapid_status")) {
    // No required inputs
  } else if (dep.isEntryPoint && dep.name === "portfolio_triage") {
    inputSchema.max_active = z.number().optional().describe("Maximum active pipelines (default: 3)");
  } else if (dep.isEntryPoint && dep.name === "revenue_review") {
    // No required inputs — operates on all selected pipelines
  } else if (dep.layer === "rapid" && !dep.isEntryPoint) {
    inputSchema.market_name = z.string().describe("The rapid test slug to check/graduate");
  } else {
    inputSchema.market_name = z.string().describe("The market/pipeline slug");
  }

  server.tool(
    dep.name,
    dep.description,
    inputSchema,
    {
      readOnlyHint: true,
      destructiveHint: false,
      openWorldHint: false,
    },
    async (args: Record<string, unknown>) => {
      try {
        return await executeSopTool(dep, sopContent, agentContent, args);
      } catch (error) {
        return {
          content: [{
            type: "text" as const,
            text: `Error running ${dep.name}: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    },
  );
}

async function executeSopTool(
  dep: ToolDependency,
  sopContent: string,
  agentContent: string | undefined,
  args: Record<string, unknown>,
) {
  const state = await readPipelineState();
  const marketName = (args.market_name as string) || (args.idea as string) || "";

  // --- Status tool: special handling ---
  if (dep.name === "status") {
    return buildStatusResponse(state, sopContent);
  }

  // --- Rapid status: special handling ---
  if (dep.name === "rapid_status") {
    return buildRapidStatusResponse(state, sopContent);
  }

  // --- Prerequisite check ---
  const prereqResult = checkPrerequisites(dep, state, marketName);
  if (!prereqResult.met) {
    return {
      content: [{
        type: "text" as const,
        text: formatBlockedMessage(dep.name, prereqResult),
      }],
    };
  }

  // --- Load upstream context ---
  let upstreamContext: Record<string, string> = {};
  if (dep.isPipelineTool && state?.pipelines[marketName]) {
    upstreamContext = await loadUpstreamContext(
      dep.name,
      marketName,
      state.pipelines[marketName] as Record<string, unknown>,
    );
  }

  // --- Match learnings ---
  const learnings = await matchLearnings(dep.learningsCategories);

  // --- Build response ---
  const sections: string[] = [];

  // Header
  sections.push(`# ${dep.name.replace(/_/g, " ").toUpperCase()} — Execute this SOP\n`);
  sections.push(`**Market:** ${marketName}`);
  sections.push(`**Output directory:** assets/${marketName}/\n`);

  // Learnings context
  if (learnings.length > 0) {
    sections.push("## Relevant Learnings from Prior Pipelines\n");
    for (const l of learnings) {
      sections.push(`- **[${l.confidence}]** ${l.pattern}`);
      sections.push(`  Evidence: ${l.evidence}\n`);
    }
    sections.push("Consider these patterns as you execute the SOP below.\n");
  }

  // Upstream context
  if (Object.keys(upstreamContext).length > 0) {
    sections.push("## Upstream Context (from previous stages)\n");
    for (const [path, content] of Object.entries(upstreamContext)) {
      sections.push(`### ${path}\n\`\`\`\n${content}\n\`\`\`\n`);
    }
  }

  // SOP instructions
  sections.push("## SOP Instructions\n");
  sections.push(sopContent);

  // Subagent instructions (if applicable)
  if (agentContent && dep.subagent) {
    sections.push("\n## Subagent Instructions\n");
    sections.push(`Delegate to the **${dep.subagent}** subagent with the following instructions:\n`);
    sections.push(agentContent);
  }

  // State update reminder
  sections.push("\n## After Execution\n");
  sections.push("Use the `update_pipeline_state` tool to update the pipeline state after completing this SOP.");
  sections.push("Use the `save_asset` tool to save any generated files to the assets directory.");

  return {
    content: [{
      type: "text" as const,
      text: sections.join("\n"),
    }],
  };
}

function buildStatusResponse(
  state: ReturnType<typeof readPipelineState> extends Promise<infer T> ? T : never,
  sopContent: string,
) {
  if (!state || (Object.keys(state.pipelines).length === 0 && Object.keys(state.rapid_tests || {}).length === 0)) {
    return {
      content: [{
        type: "text" as const,
        text: [
          "# Welcome to Launch Engine\n",
          "No active pipelines found. Three paths available:\n",
          "1. **rapid_test** — $50-100 paid traffic test in 3-5 days. Signal before commitment.",
          "2. **scout** — Full active pipeline. Deep research through validated offer with sales pages, ads, and tiered validation.",
          "3. **passive_deploy** — Marketplace assets that sell without your involvement. Requires `research` first.\n",
          "Run any of these tools to get started.",
        ].join("\n"),
      }],
    };
  }

  // Return the SOP instructions along with the current state so the LLM can format the report
  return {
    content: [{
      type: "text" as const,
      text: [
        "## Current Pipeline State\n",
        "```json",
        JSON.stringify(state, null, 2),
        "```\n",
        "## Status Report Instructions\n",
        sopContent,
      ].join("\n"),
    }],
  };
}

function buildRapidStatusResponse(
  state: ReturnType<typeof readPipelineState> extends Promise<infer T> ? T : never,
  sopContent: string,
) {
  const rapidTests = state?.rapid_tests || {};

  if (Object.keys(rapidTests).length === 0) {
    return {
      content: [{
        type: "text" as const,
        text: "No rapid tests found. Run `rapid_test` with an idea to create your first test.",
      }],
    };
  }

  return {
    content: [{
      type: "text" as const,
      text: [
        "## Rapid Tests State\n",
        "```json",
        JSON.stringify(rapidTests, null, 2),
        "```\n",
        "## Report Instructions\n",
        sopContent,
      ].join("\n"),
    }],
  };
}
