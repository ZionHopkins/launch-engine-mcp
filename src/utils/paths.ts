import { resolve } from "node:path";

function getProjectDir(): string {
  if (process.env.LAUNCH_ENGINE_PROJECT_DIR) {
    return resolve(process.env.LAUNCH_ENGINE_PROJECT_DIR);
  }

  const cliArg = process.argv.find((a) => a.startsWith("--project-dir="));
  if (cliArg) {
    return resolve(cliArg.split("=")[1]);
  }

  return process.cwd();
}

export const PROJECT_DIR = getProjectDir();

export function pipelineStatePath(): string {
  return resolve(PROJECT_DIR, "pipeline-state.json");
}

export function learningsPath(): string {
  return resolve(PROJECT_DIR, "learnings.json");
}

export function assetsDir(marketName: string): string {
  return resolve(PROJECT_DIR, "assets", marketName);
}

export function assetPath(marketName: string, filePath: string): string {
  return resolve(assetsDir(marketName), filePath);
}
