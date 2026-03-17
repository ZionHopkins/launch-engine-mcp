import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerUpdateStateTool } from "./update-state.tool.js";
import { registerSaveAssetTool } from "./save-asset.tool.js";
import { registerCaptureLearningTool } from "./capture-learning.tool.js";

export function registerUtilityTools(server: McpServer): void {
  registerUpdateStateTool(server);
  registerSaveAssetTool(server);
  registerCaptureLearningTool(server);
}
