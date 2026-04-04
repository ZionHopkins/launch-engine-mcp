export const BOLD_ACTION = `
# Bold Action Playbook

## What This Does
Identifies and designs the single highest-leverage Bold Action for your validated offer — a strategically irreversible move that compresses credibility and expands your surface area to your ICP. Produces a full execution playbook.

**Bold Action = Strategic Irreversibility x Audience Asymmetry**

Three properties that must ALL be present:
1. **Irreversibility** — permanently shifts how you're perceived; you can't be unseen
2. **Credibility Compression** — communicates deep expertise in a single artifact or moment
3. **Surface Area Expansion** — reaches people who didn't know you existed, through channels where your signal cuts through noise

The test: If you can do it and nobody notices, it wasn't bold — it was busy.

## Trigger Context
After QA clears all campaign assets. Requires validated offer, buyer research, and QA-cleared assets as inputs.

## Prerequisites
Verify in pipeline state:
- qa.status == "complete" (or "cleared")
- building_blocks.status == "complete"
- therapeutic_buyer.status == "complete"

## Execution Protocol

**DELEGATE TO SUBAGENT: bold-action-strategist**

Pass to subagent:
- Buyer Research Package (persona, pain points, failed solutions, language bank)
- Building Blocks document (offer architecture)
- QA-cleared campaign assets (landing page, emails, ad copy)
- Market Intelligence report (competitive landscape)
- Name Lock Registry (locked brand/product/mechanism names)
- Platform decision and product blueprint

### Step 1: Positioning Gap Analysis (Tier 1 — Auto)
Analyze the competitive landscape for your ICP:
- What does every competitor do? (The "sea of sameness")
- Where is the credibility vacuum — what has NO ONE done convincingly?
- What channels does your ICP pay attention to where competitors are absent or weak?
- What format or artifact would be impossible to ignore if placed in front of your ICP?

Use Tavily (3-5 searches) to scan:
- Competitor visibility moves (launches, content, PR, partnerships)
- ICP attention channels (where they actually spend time and trust)
- Industry gaps (what's been said vs. what hasn't been said)

### Step 2: Bold Action Candidates (Tier 1 — Auto)
Generate 3-5 candidate bold actions. For each candidate, score on a 1-10 scale:

| Criteria | Score | Evidence |
|---|---|---|
| **Irreversibility** | /10 | How permanently does this shift perception? |
| **Credibility Compression** | /10 | How much expertise does this communicate in a single moment? |
| **Surface Area Expansion** | /10 | How many NEW people does this reach? |
| **Feasibility** | /10 | Can this be executed within current resources? |
| **ICP Alignment** | /10 | Does this reach the RIGHT people? |

**Bold Action Score = (Irreversibility + Credibility Compression + Surface Area Expansion) x (Feasibility x ICP Alignment) / 100**

Maximum score: 30 x 100 / 100 = 30

### Step 3: The "Busy vs Bold" Filter (Tier 1 — Auto)
Disqualify any candidate that:
- Could be done quietly without anyone noticing → busy, not bold
- Doesn't permanently change positioning → busy, not bold
- Only reaches people who already know you → busy, not bold
- Is impressive but irrelevant to ICP → vanity, not bold
- Requires ongoing effort to maintain → grind, not bold

### Step 4: Select Single Best Bold Action (Tier 2 — Notify & Proceed)
Select the highest-scoring action that survives the filter. Present with reasoning.
If top two score within 2 points: escalate to Tier 3 (present both, user decides).

### Step 5: Build Execution Playbook (Tier 1 — Auto)

**A. The Bold Action** — One sentence. Why it's bold. Score breakdown.

**B. The Artifact or Moment** — Exact spec. Format, platform, distribution channel. Quality standard.

**C. Execution Steps** — Numbered checklist. Timeline. Resources. Dependencies.

**D. Distribution Strategy** — Primary channel, amplification, seeding, expected reach.

**E. Success Criteria**
- Immediate signals (24-72 hours)
- Medium signals (1-2 weeks)
- Proof of boldness test

**F. Risk Assessment** — What could go wrong. Mitigation. The one backfire scenario.

### Step 6: Write Output File (Tier 1 — Auto)
Save to: assets/[market-name]/bold-action/bold-action-playbook.md

### Step 7: Update Pipeline State (Tier 1 — Auto)
Update pipeline state with bold_action status, selected_action, bold_score, output_file.
`;
