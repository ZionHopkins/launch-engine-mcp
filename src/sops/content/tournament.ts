export const TOURNAMENT = `# /tournament — Parallel Portfolio Tournament Mode

## What This Does

Accepts 3-5 business ideas and runs them through Layer 1 as a competitive batch. Each round produces a comparison table. Users cut losers at each gate. Output: 1-2 funded winners ready for Layer 2 (/name-lock).

## Trigger Context
User wants to evaluate multiple ideas simultaneously rather than committing to one. Ideal when:
- User has 3-5 ideas and can't choose
- User wants data-driven elimination before investing in deep research
- User wants to compare unit economics across ideas before committing budget

## Prerequisites
- No active tournament (check \`tournaments\` key in pipeline-state.json)
- If an active tournament exists, present its status and ask: resume or start new?

## Execution Protocol

### Step 0: Collect Ideas

If user provides ideas inline with the command, parse them. Otherwise ask:

\`\`\`
How many ideas do you want to test? Give me 3-5 market/product ideas.
\`\`\`

Validate: minimum 3, maximum 5. If fewer than 3: "Tournament mode needs at least 3 ideas for meaningful comparison. Use /scout for a single idea."

### Step 1: Initialize Tournament State

Generate slugs for each idea. Create tournament entry in pipeline-state.json:

\`\`\`json
{
  "tournaments": {
    "[YYYY-MM-DD]": {
      "status": "active",
      "ideas": ["slug-1", "slug-2", "slug-3"],
      "current_round": "scout",
      "eliminated": {},
      "budget_total": null,
      "winners": [],
      "created": "[timestamp]",
      "updated": "[timestamp]"
    }
  }
}
\`\`\`

Also create a minimal pipeline entry under \`pipelines\` for each idea (same structure as /scout creates), with \`current_stage: "scout"\` and \`tournament: "[tournament-date-key]"\`.

Confirm to user:

\`\`\`
Starting tournament with [N] ideas.

  1. [idea-1 slug] — [brief description]
  2. [idea-2 slug] — [brief description]
  3. [idea-3 slug] — [brief description]
  ...

═══ ROUND 1: SCOUT + AUTONOMY ═══
Running scout for all [N] ideas...
\`\`\`

### Step 2: ROUND 1 — Scout + Autonomy (All Ideas)

For each idea sequentially:
1. Run the /scout SOP (read \`.claude/commands/scout.md\` and execute for this idea)
2. Immediately run /autonomy SOP (read \`.claude/commands/autonomy.md\` and execute)
3. Save outputs to \`assets/[slug]/research/\`
4. Update pipeline-state.json for that idea's pipeline entry

After ALL ideas complete, present comparison table:

\`\`\`
ROUND 1 RESULTS:
  #  | Idea                    | Scout        | Autonomy | Verdict
  1  | [slug-1]                | Proceed      | 31 HIGH  | ADVANCE
  2  | [slug-2]                | Proceed      | 24 MOD   | ADVANCE
  3  | [slug-3]                | Explore Alt  | 18 MOD   | BORDERLINE
  4  | [slug-4]                | Proceed      | 11 LOW   | CUT
\`\`\`

**Auto-cut rules:**
- LOW autonomy (≤15) → auto-recommend CUT
- Scout verdict "Explore Alternative" + MOD autonomy → BORDERLINE
- All others → ADVANCE

**Tier 3 decision:** Present cuts and ask user to confirm. User can override any recommendation. Minimum 2 ideas must survive to continue tournament (otherwise it's just a single pipeline).

Update eliminated ideas in tournament state:
\`\`\`json
"eliminated": {
  "slug-4": { "round": "scout", "reason": "LOW autonomy (11)" }
}
\`\`\`

Update \`current_round\` to \`"market_intel"\`.

### Step 3: ROUND 2 — Deep Research (Survivors Only)

For each surviving idea sequentially:
1. Delegate to market-researcher subagent (\`.claude/agents/market-researcher.md\`) — /market-intel
2. Delegate to buyer-researcher subagent (\`.claude/agents/buyer-researcher.md\`) — /research
3. Save outputs to \`assets/[slug]/research/\`
4. Update pipeline-state.json

After ALL survivors complete, present comparison:

\`\`\`
ROUND 2 RESULTS:
  #  | Idea           | Market Score | Top Niche         | Pain Depth | Language Bank
  1  | [slug-1]       | 87/120       | [niche]           | Deep       | 28 phrases
  3  | [slug-3]       | 72/120       | [niche]           | Moderate   | 19 phrases
\`\`\`

**Tier 3 decision:** User reviews. Can cut weak markets or advance all. If only 2 remain and one is clearly weaker, recommend cutting but don't force it.

Update eliminated ideas and set \`current_round\` to \`"offer_build"\`.

### Step 4: ROUND 3 — Offer Build (Survivors Only)

For each surviving idea sequentially:
1. Delegate to offer-architect subagent (\`.claude/agents/offer-architect.md\`) — /build-blocks + /stress-test in single pass
2. Save outputs to \`assets/[slug]/building-blocks/\`
3. Update pipeline-state.json

After ALL survivors complete, present side-by-side:

\`\`\`
ROUND 3 RESULTS:
  #  | Idea       | Mechanism      | Price    | USP               | Stress Score
  1  | [slug-1]   | [name]         | $197     | [usp]             | 42/50 GO
  3  | [slug-3]   | [name]         | $97/mo   | [usp]             | 35/50 REVISE
\`\`\`

**Decision handling:**
- GO → ADVANCE
- REVISE → User can choose to revise (loops that idea only, doesn't block others) or cut
- REBUILD → recommend CUT (rebuilding in tournament context wastes the speed advantage)

**Tier 3 decision:** User approves, revises, or cuts per idea. REVISE loops run inline — re-run stress test after user provides direction.

Update \`current_round\` to \`"unit_economics"\`.

### Step 5: ROUND 4 — Unit Economics (Survivors Only)

**Tier 3 decision first:** Ask user for budget allocation:

\`\`\`
Total daily ad budget across all pipelines? (This gets split across [N] survivors)

Option A: Equal split — $[X]/day each
Option B: Weighted — you assign per idea
\`\`\`

For each surviving idea:
1. Run /unit-economics SOP with allocated budget
2. Save outputs to \`assets/[slug]/research/\`
3. Update pipeline-state.json

Present final comparison:

\`\`\`
ROUND 4 RESULTS — FINAL:
  #  | Idea       | Price   | Break-even CPA | Budget  | Days to Signal | Verdict
  1  | [slug-1]   | $197    | $85            | $25/d   | 12 days        | VIABLE
  3  | [slug-3]   | $97/mo  | $42            | $25/d   | 8 days         | VIABLE
\`\`\`

### Step 6: Winner Selection

**Tier 3 decision:** Present all viable ideas with recommendation:

\`\`\`
TOURNAMENT COMPLETE — [N] ideas evaluated, [M] viable.

PICK YOUR WINNER(S) (1-2 to advance to Layer 2):

  [Recommendation based on: stress score, unit economics viability, autonomy score, market depth]

  1. [slug-1] — [one-line summary of why it's strong]
  3. [slug-3] — [one-line summary of why it's strong]

Which ideas advance? (The rest get archived with all research preserved.)
\`\`\`

### Step 7: Finalize

For winners:
- Update pipeline entry: \`current_stage\` → \`"name_lock"\` (ready for Layer 2)
- Update tournament: add to \`winners\` array

For losers:
- Archive pipeline entry (set \`archived_at\`, \`archive_reason: "Tournament elimination — Round [N]"\`)
- Trigger \`/lessons capture\` for each eliminated idea

For the tournament:
- Set \`status\` → \`"complete"\`
- Set \`updated\` timestamp

Generate tournament summary report:

\`\`\`markdown
# Tournament Report — [date]

## Ideas Evaluated: [N]
## Winners: [list]
## Eliminated: [list with round + reason]

### Round-by-Round Results
[tables from each round]

### Key Patterns
- [What differentiated winners from losers]
- [Market characteristics that correlated with strong scores]
- [Offer patterns that passed stress test]

### Research Preserved
All research for eliminated ideas is saved in assets/[slug]/ for future reference.
\`\`\`

Save to \`assets/tournaments/[date]-tournament-report.md\`.

Trigger \`/lessons capture\` for tournament-level patterns.

## Autonomy Classification

- Round execution (research, scoring): **Tier 1** — Full Auto
- Auto-cut LOW autonomy ideas: **Tier 2** — Notify & Proceed
- User cuts at each gate: **Tier 3** — Recommend & Wait
- Winner selection: **Tier 3** — Recommend & Wait
- Budget allocation: **Tier 3** — Recommend & Wait
- Any real money decisions: **Tier 4** — Escalate

## State Updates

Update \`pipeline-state.json\` after:
- Tournament initialization
- Each idea's scout/autonomy completion
- Each round's cuts
- Each idea's research/build completion
- Budget allocation
- Winner selection
- Tournament finalization

## Output Files

\`\`\`
assets/
  [idea-slug-1]/        # Standard per-pipeline directory structure
    research/
    building-blocks/
  [idea-slug-2]/
    research/
  tournaments/
    [date]-tournament-report.md
\`\`\`

## Error Handling

- If a subagent fails mid-round: save partial results, report which idea failed, offer to retry or cut that idea
- If user wants to pause mid-tournament: state is fully saved in pipeline-state.json, resume with \`/tournament\` (detects active tournament)
- If only 1 idea survives before Round 4: "Only 1 idea remaining — tournament mode no longer needed. Continue as normal pipeline? Run /build-blocks to proceed."

## Resume Logic

On \`/tournament\` when an active tournament exists:
1. Read tournament state
2. Present current status (delegate to /tournament-status logic)
3. Ask: "Resume tournament at Round [N]?" or "Start a new tournament? (This archives the current one.)"
4. If resume: pick up at \`current_round\` with surviving ideas

## Next Step

Winners proceed to \`/name-lock\` → Layer 2 as normal pipelines. The tournament is a Layer 1 accelerator — after it completes, winners are indistinguishable from any other pipeline.`;
