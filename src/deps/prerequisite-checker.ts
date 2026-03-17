import type { PipelineState } from "../types/pipeline-state.js";
import type { ToolDependency, Prerequisite } from "./dependency-graph.js";
import { getNestedValue } from "../state/pipeline-manager.js";

export interface PrerequisiteResult {
  met: boolean;
  missing: Array<{
    stage: string;
    currentStatus: string;
    requiredStatus: string;
  }>;
  fixInstructions: string[];
}

export function checkPrerequisites(
  dep: ToolDependency,
  state: PipelineState | null,
  marketName: string,
): PrerequisiteResult {
  // Entry points and read-only tools always pass
  if (dep.isEntryPoint || dep.prerequisites.length === 0) {
    return { met: true, missing: [], fixInstructions: [] };
  }

  // If no state exists at all, everything is blocked (except entry points handled above)
  if (!state) {
    return {
      met: false,
      missing: [{ stage: "pipeline-state.json", currentStatus: "missing", requiredStatus: "exists" }],
      fixInstructions: ["Run `scout` or `rapid_test` first to initialize the pipeline."],
    };
  }

  // For pipeline tools, check that the pipeline exists
  if (dep.isPipelineTool) {
    const pipeline = state.pipelines[marketName];
    if (!pipeline) {
      return {
        met: false,
        missing: [{ stage: `Pipeline "${marketName}"`, currentStatus: "missing", requiredStatus: "exists" }],
        fixInstructions: [`Run \`scout\` with market "${marketName}" first to create the pipeline.`],
      };
    }

    return checkPipelinePrerequisites(dep.prerequisites, pipeline as Record<string, unknown>, dep.name);
  }

  // For rapid test tools (non-pipeline), check rapid_tests key
  if (dep.layer === "rapid" && !dep.isEntryPoint) {
    const rapidTests = state.rapid_tests;
    if (!rapidTests || Object.keys(rapidTests).length === 0) {
      return {
        met: false,
        missing: [{ stage: "Rapid tests", currentStatus: "none", requiredStatus: "at least one" }],
        fixInstructions: ["Run `rapid_test` first to create a rapid test."],
      };
    }
    return { met: true, missing: [], fixInstructions: [] };
  }

  return { met: true, missing: [], fixInstructions: [] };
}

function checkPipelinePrerequisites(
  prerequisites: Prerequisite[],
  pipeline: Record<string, unknown>,
  toolName: string,
): PrerequisiteResult {
  const missing: PrerequisiteResult["missing"] = [];
  const fixInstructions: string[] = [];

  for (const prereq of prerequisites) {
    const currentValue = getNestedValue(pipeline, prereq.path);

    if (currentValue === undefined || currentValue === null) {
      const requiredValue = prereq.value ?? "complete";
      missing.push({
        stage: prereq.label,
        currentStatus: "not_started",
        requiredStatus: requiredValue,
      });
      fixInstructions.push(`Run \`${pathToToolName(prereq.path)}\` first.`);
    } else if (prereq.value !== undefined) {
      // Explicit value required — must match exactly
      if (String(currentValue) !== prereq.value) {
        missing.push({
          stage: prereq.label,
          currentStatus: String(currentValue),
          requiredStatus: prereq.value,
        });
        fixInstructions.push(`Run \`${pathToToolName(prereq.path)}\` first (currently "${currentValue}").`);
      }
    } else if (typeof currentValue === "string" && currentValue !== "complete" && prereq.path.endsWith(".status")) {
      // No explicit value + path ends with .status → default to requiring "complete"
      missing.push({
        stage: prereq.label,
        currentStatus: currentValue,
        requiredStatus: "complete",
      });
      if (currentValue === "in_progress") {
        fixInstructions.push(`Complete \`${pathToToolName(prereq.path)}\` (currently in progress).`);
      } else {
        fixInstructions.push(`Run \`${pathToToolName(prereq.path)}\` first.`);
      }
    }
    // Otherwise: value exists and no specific value required (existence check) → passes
  }

  return {
    met: missing.length === 0,
    missing,
    fixInstructions,
  };
}

/** Map a state path back to a tool name for fix instructions. */
function pathToToolName(path: string): string {
  const map: Record<string, string> = {
    "layer_1.scout.status": "scout",
    "autonomy_score.classification": "autonomy",
    "layer_1.market_intelligence.status": "market_intel",
    "layer_1.therapeutic_buyer.status": "research",
    "layer_1.building_blocks.status": "build_blocks",
    "layer_1.stress_test.status": "stress_test",
    "layer_1.unit_economics.status": "unit_economics",
    "layer_2.name_lock.status": "name_lock",
    "layer_2.platform.status": "platform",
    "layer_2.product.status": "product",
    "layer_2.deploy.status": "deploy",
    "layer_2.qa.status": "qa",
    "layer_2.validate_prep.status": "validate_prep",
    "traffic.traffic_strategy.status": "traffic_strategy",
    "traffic.channels.status": "channels",
    "traffic.creative_test.status": "creative_test",
    "passive.status": "passive_deploy",
  };
  return map[path] ?? path.split(".").pop()?.replace(/_/g, "_") ?? path;
}

export function formatBlockedMessage(
  toolName: string,
  result: PrerequisiteResult,
): string {
  const lines = [
    `STAGE_BLOCKED — Prerequisites not met for \`${toolName}\`.`,
    "",
    "Missing stages:",
  ];

  for (const m of result.missing) {
    lines.push(`  - ${m.stage}: status is "${m.currentStatus}", needs "${m.requiredStatus}"`);
  }

  lines.push("");
  lines.push("Run these first:");
  result.fixInstructions.forEach((fix, i) => {
    lines.push(`  ${i + 1}. ${fix}`);
  });

  return lines.join("\n");
}
