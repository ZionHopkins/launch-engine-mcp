/**
 * Extract SOPs from business-execution-os-v4 into TypeScript string exports.
 *
 * Reads:
 *   ../business-execution-os-v4/.claude/commands/*.md → src/sops/content/*.ts
 *   ../business-execution-os-v4/.claude/agents/*.md  → src/sops/agents/*.ts
 *
 * Sanitization:
 *   - Strips Windows/Unix personal paths
 *   - Removes HTML comments (implementation hints)
 *   - Removes potential API keys
 *   - Collapses excess blank lines
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_ROOT = resolve(__dirname, "../../business-execution-os-v4/.claude");
const COMMANDS_DIR = join(SOURCE_ROOT, "commands");
const AGENTS_DIR = join(SOURCE_ROOT, "agents");

const CONTENT_OUT = resolve(__dirname, "../src/sops/content");
const AGENTS_OUT = resolve(__dirname, "../src/sops/agents");

function sanitize(content: string): string {
  let result = content;

  // Strip Windows personal paths (C:\Users\username\...)
  result = result.replace(/C:\\Users\\[^\\]+\\[^\s\n`"')}\]]+/g, "");
  // Strip Unix personal paths
  result = result.replace(/\/Users\/[^/]+\/[^\s\n`"')}\]]+/g, "");
  result = result.replace(/\/home\/[^/]+\/[^\s\n`"')}\]]+/g, "");

  // Remove HTML comments (may contain implementation hints, personal notes)
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Strip potential API keys
  result = result.replace(/xkeysib-[a-f0-9]+/gi, "[REDACTED_KEY]");
  result = result.replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED_KEY]");
  result = result.replace(/Bearer\s+[a-zA-Z0-9._-]{20,}/g, "Bearer [REDACTED]");

  // Remove any stray personal business names that might appear as examples
  // (generic patterns — add specific ones if found)

  // Collapse 3+ blank lines to 2
  result = result.replace(/\n{3,}/g, "\n\n");

  // Trim trailing whitespace per line
  result = result
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");

  return result.trim();
}

function toVarName(filename: string): string {
  return basename(filename, ".md").replace(/-/g, "_").toUpperCase();
}

function toModuleName(filename: string): string {
  return basename(filename, ".md").replace(/-/g, "-");
}

async function extractFiles(
  sourceDir: string,
  outDir: string,
  kind: "content" | "agents",
): Promise<string[]> {
  await mkdir(outDir, { recursive: true });

  let files: string[];
  try {
    files = (await readdir(sourceDir)).filter((f) => f.endsWith(".md"));
  } catch {
    console.error(`Directory not found: ${sourceDir}`);
    return [];
  }

  const exports: string[] = [];

  for (const file of files) {
    const raw = await readFile(join(sourceDir, file), "utf-8");
    const clean = sanitize(raw);
    const varName = toVarName(file);
    const moduleName = toModuleName(file);

    // Escape backticks and ${} in template literal
    const escaped = clean.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

    const tsContent = `export const ${varName} = \`${escaped}\`;\n`;

    const outFile = join(outDir, `${moduleName}.ts`);
    await writeFile(outFile, tsContent, "utf-8");

    exports.push(moduleName);
    console.log(`  ${kind}: ${file} → ${moduleName}.ts (${clean.length} chars)`);
  }

  // Write index.ts re-exporting all
  const indexLines = exports.map((m) => {
    const varName = m.replace(/-/g, "_").toUpperCase();
    return `export { ${varName} } from "./${m}.js";`;
  });
  await writeFile(join(outDir, "index.ts"), indexLines.join("\n") + "\n", "utf-8");

  return exports;
}

async function verifyNoLeaks(outDir: string): Promise<boolean> {
  const files = (await readdir(outDir)).filter((f) => f.endsWith(".ts"));
  let clean = true;

  for (const file of files) {
    const content = await readFile(join(outDir, file), "utf-8");

    // Check for personal paths
    if (/C:\\Users\\[^\\]+\\/i.test(content)) {
      console.error(`LEAK: ${file} contains Windows personal path`);
      clean = false;
    }
    if (/\/Users\/[^/]+\//i.test(content)) {
      console.error(`LEAK: ${file} contains macOS personal path`);
      clean = false;
    }
    if (/\/home\/[^/]+\//i.test(content)) {
      console.error(`LEAK: ${file} contains Linux personal path`);
      clean = false;
    }

    // Check for API key patterns
    if (/xkeysib-[a-f0-9]{10,}/i.test(content)) {
      console.error(`LEAK: ${file} contains Brevo API key`);
      clean = false;
    }
    if (/sk-[a-zA-Z0-9]{20,}/.test(content)) {
      console.error(`LEAK: ${file} contains sk- API key`);
      clean = false;
    }
  }

  return clean;
}

async function main() {
  console.log("Extracting SOPs from business-execution-os-v4...\n");

  console.log("Commands:");
  const commands = await extractFiles(COMMANDS_DIR, CONTENT_OUT, "content");
  console.log(`\n  → ${commands.length} command files extracted\n`);

  console.log("Agents:");
  const agents = await extractFiles(AGENTS_DIR, AGENTS_OUT, "agents");
  console.log(`\n  → ${agents.length} agent files extracted\n`);

  console.log("Running leak verification...");
  const contentClean = await verifyNoLeaks(CONTENT_OUT);
  const agentsClean = await verifyNoLeaks(AGENTS_OUT);

  if (contentClean && agentsClean) {
    console.log("✓ No personal info leaks detected.\n");
  } else {
    console.error("✗ LEAKS DETECTED — fix before publishing!\n");
    process.exit(1);
  }

  console.log("Done.");
}

main().catch(console.error);
