import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { saveAsset } from "../state/asset-manager.js";
import { toMarketSlug } from "../utils/market-slug.js";

export function registerSaveAssetTool(server: McpServer): void {
  server.tool(
    "save_asset",
    "Save a file to the assets/[market-name]/ directory. Use for all pipeline outputs: research, building blocks, copy, campaigns, etc.",
    {
      market_name: z.string().describe("The market/pipeline slug"),
      file_path: z.string().describe("Path relative to assets/[market-name]/, e.g. 'research/scout-report.md'"),
      content: z.string().describe("The file content to write"),
    },
    async (args) => {
      try {
        const slug = toMarketSlug(args.market_name as string);
        const fullPath = await saveAsset(slug, args.file_path as string, args.content as string);

        return {
          content: [{
            type: "text" as const,
            text: `Asset saved: assets/${slug}/${args.file_path}\n\nFull path: ${fullPath}`,
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text" as const,
            text: `Error saving asset: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    },
  );
}
