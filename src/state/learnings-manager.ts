import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { learningsPath } from "../utils/paths.js";
import { LearningsSchema, type Learnings, type LearningEntry, type LearningCategory } from "../types/learnings.js";
import { emptyLearnings } from "./initializers.js";

export async function readLearnings(): Promise<Learnings> {
  try {
    const raw = await readFile(learningsPath(), "utf-8");
    return LearningsSchema.parse(JSON.parse(raw));
  } catch {
    return emptyLearnings();
  }
}

export async function writeLearnings(learnings: Learnings): Promise<void> {
  const filePath = learningsPath();
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(learnings, null, 2), "utf-8");
}

export async function addLearning(entry: Omit<LearningEntry, "id">): Promise<LearningEntry> {
  const learnings = await readLearnings();
  const maxId = learnings.learnings.reduce((max, l) => Math.max(max, l.id), 0);
  const newEntry: LearningEntry = { ...entry, id: maxId + 1 };
  learnings.learnings.push(newEntry);
  await writeLearnings(learnings);
  return newEntry;
}

export async function queryLearnings(filters: {
  category?: LearningCategory;
  tags?: string[];
  pipeline?: string;
  stage?: string;
  confidence?: string;
}): Promise<LearningEntry[]> {
  const learnings = await readLearnings();
  return learnings.learnings.filter((l) => {
    if (filters.category && l.category !== filters.category) return false;
    if (filters.pipeline && l.pipeline !== filters.pipeline) return false;
    if (filters.stage && l.stage !== filters.stage) return false;
    if (filters.confidence && l.confidence !== filters.confidence) return false;
    if (filters.tags && filters.tags.length > 0) {
      const hasAnyTag = filters.tags.some((t) => l.tags.includes(t));
      if (!hasAnyTag) return false;
    }
    return true;
  });
}
