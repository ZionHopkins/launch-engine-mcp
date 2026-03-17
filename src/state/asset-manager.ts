import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { assetPath, assetsDir } from "../utils/paths.js";

export async function saveAsset(
  marketName: string,
  filePath: string,
  content: string,
): Promise<string> {
  const fullPath = assetPath(marketName, filePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, "utf-8");
  return fullPath;
}

export async function readAsset(
  marketName: string,
  filePath: string,
): Promise<string | null> {
  try {
    return await readFile(assetPath(marketName, filePath), "utf-8");
  } catch {
    return null;
  }
}

export async function listAssets(marketName: string): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const { join, relative } = await import("node:path");

  const baseDir = assetsDir(marketName);
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
        } else {
          results.push(relative(baseDir, full).replace(/\\/g, "/"));
        }
      }
    } catch {
      // Directory doesn't exist yet
    }
  }

  await walk(baseDir);
  return results;
}
