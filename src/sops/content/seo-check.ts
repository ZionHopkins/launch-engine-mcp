export const SEO_CHECK = `# /seo-check — Monthly SEO/GEO Audit

## What This Does

Runs a comprehensive SEO and GEO (Generative Engine Optimization) audit across all published content. Checks technical health, content freshness, AI citation status, competitive positioning, and generates a prioritized refresh list. Keeps organic growth compounding instead of decaying.

## Trigger Context
- **First run:** Month 2 Week 4 of content calendar (after at least 1 pillar + spokes published)
- **Recurring:** Monthly thereafter (content calendar Week 4 = audit week)
- **On-demand:** User types \`/seo-check\` anytime

## Prerequisites
- \`/content-engine\` complete (topic cluster map + at least 1 pillar published)
- Content published and indexed (at least 30 days old for meaningful data)

If content_engine is not complete:
\`\`\`
STAGE_BLOCKED — Prerequisites not met.

Missing stages:
  - content_engine: status is "pending", needs "complete"

Run /content-engine first to generate topic clusters and content.
\`\`\`

## Modes
- \`--mode monthly\` (default) — Full 5-phase audit, 3-5 searches. Standard monthly cadence.
- \`--mode quick\` — Tech + decay checks only, 0-1 searches. Use between monthly audits if something seems off.
- \`--mode deep\` — Full audit + expanded competitive analysis, 5-8 searches. Run quarterly or when organic traffic shifts significantly.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`seo-auditor\`**

### Step 0: Check Learnings
Silently check \`learnings.json\` for patterns tagged \`seo\`, \`content_decay\`, \`ai_visibility\`. If relevant patterns exist, pass them to the subagent as context.

### Step 1: Gather Inputs and Delegate
Collect and pass to subagent:
- Topic cluster map (\`assets/[market-name]/content/topic-cluster-map.md\`)
- All published content paths (\`assets/[market-name]/content/pillar/\`, \`content/spokes/\`)
- AI visibility baseline (\`assets/[market-name]/content/ai-visibility-baseline.md\`)
- Last audit report (if exists: \`assets/[market-name]/content/audits/\`)
- Name Lock Registry (\`assets/[market-name]/building-blocks/name-lock-registry.md\`)
- Audit mode (\`monthly\`, \`quick\`, or \`deep\`)

Invoke \`seo-auditor\` subagent with all inputs and the specified mode.

### Step 2: Receive and Save Audit Report
Save the subagent's output to:
\`\`\`
assets/[market-name]/content/audits/audit-[YYYY-MM].md
\`\`\`

### Step 3: Update Pipeline State
\`\`\`json
{
  "organic_growth": {
    "seo_checks": {
      "last_check": "[timestamp]",
      "last_check_mode": "[monthly/quick/deep]",
      "next_check": "[date — 30 days from now]",
      "checks_completed": [N+1],
      "last_score": "[overall score from audit]",
      "top_actions": ["[action 1]", "[action 2]", "[action 3]"]
    }
  }
}
\`\`\`

### Step 4: Surface Top 3 Actions
Present the top 3 highest-impact actions from the audit:

\`\`\`
SEO/GEO AUDIT COMPLETE — [Month Year]

Overall Score: [X/100]

TOP 3 ACTIONS:
1. [Highest impact action — e.g., "Refresh Pillar 1 stats (6 months stale)"]
2. [Second action — e.g., "Add FAQ schema to Spoke 2.3 (missing)"]
3. [Third action — e.g., "Citation magnet gap: no AI mentions of [framework name]"]

Full report: assets/[market-name]/content/audits/audit-[YYYY-MM].md
Next audit: [date]
\`\`\`

## Autonomy
Tier 1 — Full Auto for running the audit and generating the report.
Tier 2 — Notify & Proceed for presenting recommendations.

## Output
Audit report saved to \`content/audits/\`. Pipeline state updated. Top 3 actions presented inline.

## Next Step
Execute recommended actions → content refreshes feed back into \`/content-repurpose\` → next \`/seo-check\` in 30 days.`;
