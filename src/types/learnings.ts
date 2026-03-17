import { z } from "zod";

export const LearningCategorySchema = z.enum([
  "market_selection",
  "offer_design",
  "creative",
  "traffic",
  "funnel",
  "product",
  "scaling",
  "process",
  "distribution",
  "relationship_marketing",
]);

export const LearningEntrySchema = z.object({
  id: z.number(),
  date: z.string(),
  pipeline: z.string(),
  stage: z.string(),
  category: LearningCategorySchema,
  pattern: z.string(),
  evidence: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  applies_to: z.string(),
  tags: z.array(z.string()),
});

export const LearningsSchema = z.object({
  version: z.string().default("1.0"),
  learnings: z.array(LearningEntrySchema).default([]),
});

export type LearningCategory = z.infer<typeof LearningCategorySchema>;
export type LearningEntry = z.infer<typeof LearningEntrySchema>;
export type Learnings = z.infer<typeof LearningsSchema>;
