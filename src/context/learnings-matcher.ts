import { queryLearnings } from "../state/learnings-manager.js";
import type { LearningCategory, LearningEntry } from "../types/learnings.js";

/**
 * Find relevant learnings for a tool about to execute.
 * Returns formatted learning summaries for inclusion in SOP context.
 */
export async function matchLearnings(
  categories: string[],
  tags?: string[],
): Promise<Array<{ pattern: string; evidence: string; confidence: string }>> {
  if (categories.length === 0 && (!tags || tags.length === 0)) {
    return [];
  }

  const results: LearningEntry[] = [];
  const seenIds = new Set<number>();

  for (const cat of categories) {
    const matches = await queryLearnings({
      category: cat as LearningCategory,
    });
    for (const m of matches) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        results.push(m);
      }
    }
  }

  if (tags && tags.length > 0) {
    const tagMatches = await queryLearnings({ tags });
    for (const m of tagMatches) {
      if (!seenIds.has(m.id)) {
        seenIds.add(m.id);
        results.push(m);
      }
    }
  }

  // Sort by confidence: high first, then medium, then low
  const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => (order[a.confidence] ?? 3) - (order[b.confidence] ?? 3));

  // Return top 5 most relevant
  return results.slice(0, 5).map((l) => ({
    pattern: l.pattern,
    evidence: l.evidence,
    confidence: l.confidence,
  }));
}
