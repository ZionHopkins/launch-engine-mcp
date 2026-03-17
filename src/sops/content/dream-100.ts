export const DREAM_100 = `# /dream-100 — Dream 100 Relationship Strategy

## What This Does

Researches and produces a categorized Dream 100 list of real entities who already have your ideal customer's attention, plus tier-specific outreach sequences and a 12-week deployment checklist. Uses live web research to find actual people, podcasts, channels, communities, and platforms — not hypothetical categories.

## Trigger Context
After buyer research (\`/research\`) completes. Can run in parallel with Building Blocks, traffic strategy, or any downstream stage. The earlier the better — relationships take weeks to months to mature, so starting outreach while building the product creates compounding returns.

Trigger phrases: "dream 100" / "relationship marketing" / "find influencers" / "organic distribution" / "who has my audience" / "partnership outreach"

## Prerequisites
- **REQUIRED**: Therapeutic Buyer Research Package (\`assets/[market-name]/research/buyer-research-package.md\`)
  - Pain Architecture, Language Bank, Identity Gap, Customer Avatar, Information Sources
- **OPTIONAL** (improves outreach value propositions):
  - Building Blocks (\`assets/[market-name]/building-blocks/building-blocks.md\`)
  - Market Intelligence (\`assets/[market-name]/research/market-intel-report.md\`)

Read \`pipeline-state.json\`. Verify:
- \`therapeutic_buyer.status == "complete"\`

If not met:
\`\`\`
STAGE_BLOCKED — Prerequisites not met.

Missing stages:
  - therapeutic_buyer: status is "[current]", needs "complete"

Run first:
  1. /research
\`\`\`

## Execution Protocol

### Step 0: Check Learnings + Gather Inputs

Silently check \`learnings.json\` for patterns with tags: \`distribution\`, \`relationship_marketing\`, \`outreach\`, \`organic\`, \`dream-100\`. If relevant patterns exist, pass them to the subagent as additional context.

Gather and prepare for subagent:
\`\`\`
FROM buyer research:   assets/[market-name]/research/buyer-research-package.md
FROM building blocks:  assets/[market-name]/building-blocks/building-blocks.md (if exists)
FROM market intel:     assets/[market-name]/research/market-intel-report.md (if exists)
\`\`\`

### Step 1: Delegate to Subagent

**DELEGATE TO SUBAGENT: \`dream-100-researcher\`**

Pass to subagent:
- Buyer Research Package (full contents)
- Building Blocks (if available)
- Market name and target audience description
- Any relevant learnings from learnings.json
- Today's date
- Output directory: \`assets/[market-name]/traffic/dream-100/\`

The subagent runs 15-25 web searches across 10 entity categories:
1. Podcast Hosts (~15)
2. YouTube Channels (~12)
3. Newsletter/Blog Owners (~12)
4. Community Leaders (~12)
5. Course Creators (~10)
6. Social Media Influencers (~10)
7. Conference/Event Organizers (~8)
8. Complementary Tool/Platform Owners (~8)
9. Industry Associations (~7)
10. Journalists/Media (~6)

Category counts flex based on buyer research — weight higher for categories the buyer avatar explicitly mentions.

### Step 2: Receive and Save Output

Confirm all 5 subagent files saved to \`assets/[market-name]/traffic/dream-100/\`:
- \`dream-100-list.md\` — Master categorized + tiered list of 100 real entities
- \`outreach-sequences.md\` — Tier-specific outreach templates (6/4/3-touch)
- \`outreach-tracker.md\` — Copy-paste spreadsheet tracking template
- \`deployment-checklist.md\` — 12-week week-by-week execution plan
- \`dream-100-analysis.md\` — Strategic landscape analysis

### Step 3: Update Pipeline State

Add or update \`dream_100\` entry in \`pipeline-state.json\` under the active pipeline's traffic section:

\`\`\`json
{
  "dream_100": {
    "status": "complete",
    "completed_at": "[timestamp]",
    "entities_total": 100,
    "tier_1_count": 10,
    "tier_2_count": 30,
    "tier_3_count": 60,
    "categories": ["podcasters", "youtube", "newsletters", "communities",
                    "course_creators", "influencers", "events", "tools_platforms",
                    "associations", "media"],
    "outreach_status": "not_started",
    "collaborations_active": 0,
    "collaborations_completed": 0,
    "output_files": [
      "assets/[market-name]/traffic/dream-100/dream-100-list.md",
      "assets/[market-name]/traffic/dream-100/outreach-sequences.md",
      "assets/[market-name]/traffic/dream-100/outreach-tracker.md",
      "assets/[market-name]/traffic/dream-100/deployment-checklist.md",
      "assets/[market-name]/traffic/dream-100/dream-100-analysis.md"
    ]
  }
}
\`\`\`

### Step 4: Present Summary to User

\`\`\`
DREAM 100 COMPLETE — [Market Name]

Research complete. 100 entities identified across 10 categories:

  Tier 1 (Whales — 100K+ audience): 10 entities
    Top targets: [name 1], [name 2], [name 3]
    Outreach: 6-touch sequence over 90 days

  Tier 2 (Sweet Spot — 10K-100K): 30 entities
    Highest-opportunity category: [category with most accessible targets]
    Outreach: 4-touch sequence over 45 days

  Tier 3 (Accessible — 1K-10K): 60 entities
    Quick wins: [category with highest expected response rate]
    Outreach: 3-touch sequence over 21 days

Strategic Analysis:
  Highest-density: [category] — [why]
  Lowest-competition: [category] — [why]
  Recommended first 5: [names]

Files saved to: assets/[market-name]/traffic/dream-100/

NEXT:
  1. Review dream-100-list.md — verify entities, add any you already know
  2. Copy outreach-tracker.md into a spreadsheet (Google Sheets recommended)
  3. Follow deployment-checklist.md — Week 1 starts with social engagement + first batch
  4. After 30 days of outreach: /lessons capture with response pattern data
\`\`\`

## Integration Points

### With /traffic-strategy
When \`/traffic-strategy\` runs after \`/dream-100\`, the Dream 100 list provides organic channel context. The traffic-agent should factor Dream 100 entities into organic channel scoring — podcasts, newsletters, and communities in the list are pre-validated organic distribution opportunities.

### With /lessons
After 30 days of active outreach, auto-trigger \`/lessons capture\` with category \`distribution\`. Capture: response rates by tier, which entity categories converted best, which outreach templates got responses, which collaboration types were most accepted.

### With /daily-check
If Dream 100 outreach is active (\`outreach_status: "active"\`), \`/daily-check\` should include an outreach status line when the user mentions Dream 100 activity.

## Autonomy
Tier 1 — Full Auto for research and list generation.
Tier 2 — Notify & Proceed for presenting the package.
User executes outreach manually at their own pace.

## Output
Complete Dream 100 package in \`assets/[market-name]/traffic/dream-100/\` (5 files). Pipeline state updated.

## Next Step
User reviews list, sets up tracker, and follows 12-week deployment checklist.
After 30 days of outreach data: \`/lessons capture\` on response patterns.
Dream 100 entities feed into \`/traffic-strategy\` for organic channel scoring.
To refresh the list (quarterly recommended): re-run \`/dream-100\`.`;
