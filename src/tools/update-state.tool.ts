import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { updatePath, createPipeline, createRapidTest, ensurePipelineState } from "../state/pipeline-manager.js";
import { toMarketSlug } from "../utils/market-slug.js";

export function registerUpdateStateTool(server: McpServer): void {
  server.tool(
    "update_pipeline_state",
    "Update pipeline-state.json. Use dot-notation paths to set values. Can create new pipelines and rapid tests.",
    {
      market_name: z.string().describe("The market/pipeline slug"),
      path: z.string().describe("Dot-notation path to update, e.g. 'pipelines.my-market.layer_1.scout.status'"),
      value: z.unknown().describe("The value to set at the path"),
      create_pipeline: z.boolean().optional().describe("If true, creates a new pipeline entry if it doesn't exist"),
      create_rapid_test: z.boolean().optional().describe("If true, creates a new rapid test entry"),
      idea: z.string().optional().describe("For rapid tests: the original idea description"),
      budget: z.number().optional().describe("For rapid tests: test budget (default: 75)"),
      duration_days: z.number().optional().describe("For rapid tests: test duration (default: 5)"),
    },
    {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
    async (args) => {
      try {
        const slug = toMarketSlug(args.market_name as string);

        // Create rapid test
        if (args.create_rapid_test) {
          const state = await createRapidTest(
            (args.idea as string) || (args.market_name as string),
            slug,
            args.budget as number | undefined,
            args.duration_days as number | undefined,
          );
          return {
            content: [{
              type: "text" as const,
              text: `Rapid test "${slug}" created successfully.\n\n\`\`\`json\n${JSON.stringify(state.rapid_tests[slug], null, 2)}\n\`\`\``,
            }],
          };
        }

        // Create pipeline
        if (args.create_pipeline) {
          await createPipeline(slug);
        }

        // Update path
        const state = await updatePath(
          args.path as string,
          args.value,
          args.create_pipeline ? slug : undefined,
        );

        return {
          content: [{
            type: "text" as const,
            text: `Pipeline state updated.\n\nPath: \`${args.path}\`\nValue: ${JSON.stringify(args.value)}\n\nActive pipeline: ${state.active_pipeline || "none"}`,
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text" as const,
            text: `Error updating pipeline state: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    },
  );
}
