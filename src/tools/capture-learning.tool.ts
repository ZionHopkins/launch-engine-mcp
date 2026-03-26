import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { addLearning } from "../state/learnings-manager.js";
import type { LearningCategory } from "../types/learnings.js";

export function registerCaptureLearningTool(server: McpServer): void {
  server.tool(
    "capture_learning",
    "Capture a reusable learning/pattern to learnings.json. Called after key decisions, verdicts, and pipeline milestones.",
    {
      pipeline: z.string().describe("Market name / pipeline that produced this learning"),
      stage: z.string().describe("Which SOP/stage generated this learning (e.g. 'scout', 'stress-test')"),
      category: z.enum([
        "market_selection", "offer_design", "creative", "traffic",
        "funnel", "product", "scaling", "process", "distribution",
        "relationship_marketing",
      ]).describe("Learning category"),
      pattern: z.string().describe("One sentence — the reusable insight"),
      evidence: z.string().describe("What data supports this pattern"),
      confidence: z.enum(["high", "medium", "low"]).describe("Confidence level based on evidence strength"),
      applies_to: z.string().describe("What future decisions this informs"),
      tags: z.array(z.string()).describe("Searchable keywords for retrieval"),
    },
    {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false,
    },
    async (args) => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const entry = await addLearning({
          date: today,
          pipeline: args.pipeline as string,
          stage: args.stage as string,
          category: args.category as LearningCategory,
          pattern: args.pattern as string,
          evidence: args.evidence as string,
          confidence: args.confidence as "high" | "medium" | "low",
          applies_to: args.applies_to as string,
          tags: args.tags as string[],
        });

        return {
          content: [{
            type: "text" as const,
            text: `Learning #${entry.id} captured.\n\n**Pattern:** ${entry.pattern}\n**Category:** ${entry.category}\n**Confidence:** ${entry.confidence}\n**Tags:** ${entry.tags.join(", ")}`,
          }],
        };
      } catch (error) {
        return {
          content: [{
            type: "text" as const,
            text: `Error capturing learning: ${error instanceof Error ? error.message : String(error)}`,
          }],
          isError: true,
        };
      }
    },
  );
}
