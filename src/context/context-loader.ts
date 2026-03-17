import { readFile } from "node:fs/promises";
import { assetPath } from "../utils/paths.js";
import type { PipelineState } from "../types/pipeline-state.js";
import { getNestedValue } from "../state/pipeline-manager.js";

const MAX_CONTEXT_BYTES = 8 * 1024; // 8KB per upstream file

/**
 * Upstream file map: for each tool, which previous output files to load as context.
 * Keys are tool names, values are arrays of state paths that contain output_file references.
 */
const UPSTREAM_FILES: Record<string, string[]> = {
  autonomy: ["layer_1.scout.output_file"],
  market_intel: ["layer_1.scout.output_file"],
  research: ["layer_1.scout.output_file", "layer_1.market_intelligence.output_file"],
  build_blocks: ["layer_1.therapeutic_buyer.output_file"],
  stress_test: ["layer_1.building_blocks.output_file"],
  unit_economics: ["layer_1.building_blocks.output_file", "layer_1.stress_test.output_file"],
  name_lock: ["layer_1.building_blocks.output_file", "layer_1.stress_test.output_file"],
  platform: ["layer_1.building_blocks.output_file", "layer_1.stress_test.output_file"],
  product: ["layer_1.building_blocks.output_file", "layer_2.name_lock.output_file"],
  deploy: [
    "layer_1.therapeutic_buyer.output_file",
    "layer_1.building_blocks.output_file",
    "layer_2.product.output_file",
  ],
  qa: ["layer_2.deploy.output_file"],
  validate_prep: ["layer_2.deploy.output_file", "layer_2.qa.output_file"],
  traffic_strategy: ["layer_1.therapeutic_buyer.output_file", "layer_2.deploy.output_file"],
  channels: ["traffic.traffic_strategy.output_file"],
  creative_test: ["traffic.channels.output_file", "layer_1.therapeutic_buyer.output_file"],
  funnel_optimize: ["traffic.channels.output_file"],
  dream_100: ["layer_1.therapeutic_buyer.output_file"],
  passive_deploy: ["layer_1.therapeutic_buyer.output_file"],
  feedback: ["layer_2.deploy.output_file"],
  voice_extract: ["layer_2.qa.output_file"],
};

/**
 * Load upstream context files for a tool.
 * Returns a record of { relative_path: truncated_content }.
 */
export async function loadUpstreamContext(
  toolName: string,
  marketName: string,
  pipeline: Record<string, unknown>,
): Promise<Record<string, string>> {
  const paths = UPSTREAM_FILES[toolName];
  if (!paths || paths.length === 0) return {};

  const context: Record<string, string> = {};

  for (const statePath of paths) {
    const filePath = getNestedValue(pipeline, statePath) as string | undefined;
    if (!filePath) continue;

    try {
      // File paths in state are relative like "assets/market/research/file.md"
      // Resolve against project dir
      const { resolve } = await import("node:path");
      const { PROJECT_DIR } = await import("../utils/paths.js");
      const fullPath = resolve(PROJECT_DIR, filePath);

      const content = await readFile(fullPath, "utf-8");
      context[filePath] = truncate(content, MAX_CONTEXT_BYTES);
    } catch {
      // File doesn't exist yet — skip silently
    }
  }

  return context;
}

function truncate(content: string, maxBytes: number): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(content);
  if (bytes.length <= maxBytes) return content;

  // Truncate and append notice
  const decoder = new TextDecoder();
  const truncated = decoder.decode(bytes.slice(0, maxBytes));
  return truncated + "\n\n[... truncated to 8KB — full file available in assets/ directory]";
}
