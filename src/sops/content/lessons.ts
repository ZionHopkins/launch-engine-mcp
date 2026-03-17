export const LESSONS = `# /lessons — Pattern Library & Learnings Engine

## What This Does

Captures structured learnings from pipeline decisions, validation results, and operational experience. Builds a searchable pattern library that makes each subsequent pipeline faster and more accurate.

## Trigger Context
Three modes:
1. **Capture** — After any significant decision point (validation verdict, creative test results, kill decision, successful scale)
2. **Retrieve** — Before starting a new pipeline or making a strategic decision
3. **Review** — Periodic review of accumulated patterns to identify meta-patterns

## Execution Protocol

### MODE 1: Capture Learnings

Triggered by: \`/lessons capture\` or automatically after \`/validate-decide\` kill/advance verdicts.

**Step 1: Extract the Pattern**

Ask (or infer from pipeline data):
- What happened? (the event)
- What did the data show? (the evidence)
- Why did it happen? (the hypothesis)
- What would you do differently? (the learning)
- Where does this apply? (the transfer — which future situations does this inform?)

**Step 2: Structure the Learning**

Format as a structured entry:

\`\`\`json
{
  "id": "[auto-increment]",
  "date": "[timestamp]",
  "pipeline": "[market name]",
  "stage": "[which SOP/stage this learning came from]",
  "category": "[one of: market_selection, offer_design, creative, traffic, funnel, product, scaling, process]",
  "pattern": "[one sentence — the reusable insight]",
  "evidence": "[what data supports this]",
  "confidence": "[high/medium/low — based on sample size and repeatability]",
  "applies_to": "[what future decisions this informs]",
  "tags": ["[searchable tags]"]
}
\`\`\`

**Step 3: Check for Conflicts**

Read existing \`learnings.json\`. Does this new learning:
- Confirm an existing pattern? → Upgrade that pattern's confidence level.
- Contradict an existing pattern? → Flag the contradiction. Note the context difference.
- Add nuance? → Append as a sub-learning to the existing pattern.

**Step 4: Store**

Append to \`learnings.json\` in project root.

Example entries:
\`\`\`json
{
  "id": 1,
  "date": "2026-03-15",
  "pipeline": "metabolic-shift-workers",
  "stage": "creative_testing",
  "category": "creative",
  "pattern": "Mechanism-first hooks outperform pain-first hooks 2.5:1 in health markets with sophistication level 3+",
  "evidence": "Batch 1: mechanism hook CTR 2.3%, pain hook CTR 0.9%. Batch 2 confirmed: 2.1% vs 0.8%.",
  "confidence": "medium",
  "applies_to": "All health/wellness markets where buyers have already tried multiple solutions",
  "tags": ["creative", "hooks", "health", "mechanism", "sophistication"]
}
\`\`\`

\`\`\`json
{
  "id": 2,
  "date": "2026-03-22",
  "pipeline": "metabolic-shift-workers",
  "stage": "validation_tier_1",
  "category": "market_selection",
  "pattern": "Markets where the Language Bank contains 'I've tried everything' language convert better on contrarian-belief hooks than on promise hooks",
  "evidence": "Tier 1 validation: contrarian ad CTR 3.1% vs promise ad CTR 1.4%. Signups 4:1 ratio.",
  "confidence": "low",
  "applies_to": "High-sophistication markets (level 4-5) in any vertical",
  "tags": ["market_selection", "sophistication", "contrarian", "hooks"]
}
\`\`\`

### MODE 2: Retrieve Learnings

Triggered by: \`/lessons [topic]\` or automatically at the start of relevant SOPs.

**Step 1: Search Pattern Library**

Search \`learnings.json\` for entries matching:
- The current market's characteristics (category, tags)
- The current SOP being run
- The specific decision being made

**Step 2: Present Relevant Patterns**

\`\`\`
RELEVANT LEARNINGS for [current context]:

🔵 HIGH CONFIDENCE:
  #[id]: "[pattern]" — from [pipeline] ([date])
  → Implication for current decision: [how to apply this]

🟡 MEDIUM CONFIDENCE:
  #[id]: "[pattern]" — from [pipeline] ([date])
  → Consider: [how this might apply, with caveats]

⚪ LOW CONFIDENCE (limited data):
  #[id]: "[pattern]" — from [pipeline] ([date])
  → Hypothesis to test: [frame as something to validate, not assume]
\`\`\`

**Step 3: Integration**

When a new SOP runs, automatically check learnings.json for relevant patterns and surface them inline. The SOP doesn't change — but Claude presents relevant prior learnings as context before executing.

### MODE 3: Review & Meta-Patterns

Triggered by: \`/lessons review\` — run monthly or after every 3rd pipeline.

**Step 1: Load All Learnings**

Read complete \`learnings.json\`.

**Step 2: Identify Meta-Patterns**

Look across entries for:
- Patterns that repeat across multiple pipelines (→ upgrade to high confidence)
- Categories with the most learnings (→ your strongest knowledge area)
- Categories with few learnings (→ blind spots to investigate)
- Contradictions (→ context-dependent patterns to investigate)
- Time-based evolution (→ are your recent learnings contradicting older ones? You're getting smarter.)

**Step 3: Generate Pattern Report**

\`\`\`
PATTERN LIBRARY REVIEW — [date]
Total learnings: [N]
Pipelines contributing: [list]

TOP PATTERNS (highest confidence, most reinforced):
  1. "[pattern]" — confirmed across [N] pipelines
  2. "[pattern]" — confirmed across [N] pipelines

EMERGING PATTERNS (medium confidence, worth testing):
  1. "[pattern]" — from [N] pipelines, needs more data

CONTRADICTIONS TO RESOLVE:
  1. Learning #[X] says [A] but Learning #[Y] says [B]
     Context difference: [what was different between the two situations]

BLIND SPOTS (categories with <2 learnings):
  [list — these are areas where you're operating on intuition, not data]

YOUR EVOLUTION:
  [Brief narrative of how your pattern recognition has developed over time]
\`\`\`

Save report to \`assets/pattern-library-review-[date].md\`

## Integration with Pipeline

These SOPs should auto-check learnings.json before execution:
- \`/scout\` — check market_selection patterns
- \`/build-blocks\` — check offer_design patterns
- \`/creative-test\` — check creative patterns
- \`/traffic-strategy\` — check traffic patterns
- \`/funnel-optimize\` — check funnel patterns
- \`/scale\` — check scaling patterns

The check is silent unless relevant patterns exist. When they do, present them as "Prior learning suggests..." before executing the SOP.

## Autonomy
Tier 1 — Full Auto for capture and retrieve.
Tier 2 — Notify & Proceed for review reports.

## Output
Entries stored in \`learnings.json\`. Reports saved to assets folder when generated.`;
