import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSopTools } from "./tools/register-sop-tools.js";
import { registerUtilityTools } from "./tools/register-utility-tools.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "asset-factory",
    version: "1.2.0",
  });

  registerSopTools(server);
  registerUtilityTools(server);

  return server;
}
