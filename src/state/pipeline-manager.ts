import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { pipelineStatePath } from "../utils/paths.js";
import { PipelineStateSchema, type PipelineState } from "../types/pipeline-state.js";
import { emptyPipelineState, newPipelineEntry, newRapidTestEntry } from "./initializers.js";

export async function readPipelineState(): Promise<PipelineState | null> {
  try {
    const raw = await readFile(pipelineStatePath(), "utf-8");
    return PipelineStateSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function writePipelineState(state: PipelineState): Promise<void> {
  const filePath = pipelineStatePath();
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(state, null, 2), "utf-8");
}

export async function ensurePipelineState(): Promise<PipelineState> {
  const existing = await readPipelineState();
  if (existing) return existing;
  const empty = emptyPipelineState();
  await writePipelineState(empty);
  return empty;
}

export async function createPipeline(marketName: string): Promise<PipelineState> {
  const state = await ensurePipelineState();
  if (!state.pipelines[marketName]) {
    state.pipelines[marketName] = newPipelineEntry(marketName) as any;
  }
  state.active_pipeline = marketName;
  await writePipelineState(state);
  return state;
}

export async function createRapidTest(
  idea: string,
  slug: string,
  budget?: number,
  durationDays?: number,
  offerType?: string,
  pricePoint?: number | null,
): Promise<PipelineState> {
  const state = await ensurePipelineState();
  if (!state.rapid_tests) {
    state.rapid_tests = {};
  }
  state.rapid_tests[slug] = newRapidTestEntry(idea, slug, budget, durationDays, offerType, pricePoint) as any;
  await writePipelineState(state);
  return state;
}

/**
 * Update a nested value in pipeline state using dot-notation path.
 * Example: updatePath("pipelines.my-market.layer_1.scout.status", "complete")
 */
export async function updatePath(
  path: string,
  value: unknown,
  createPipelineIfMissing?: string,
): Promise<PipelineState> {
  let state = await ensurePipelineState();

  if (createPipelineIfMissing && !state.pipelines[createPipelineIfMissing]) {
    state = await createPipeline(createPipelineIfMissing);
  }

  const parts = path.split(".");
  let current: any = state;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;

  // Update the "updated" timestamp if we're modifying a pipeline
  if (parts[0] === "pipelines" && parts.length > 1) {
    const pipelineName = parts[1];
    if (state.pipelines[pipelineName]) {
      (state.pipelines[pipelineName] as any).updated = new Date().toISOString().split("T")[0];
    }
  }

  await writePipelineState(state);
  return state;
}

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
}
