export const CHANNELS = `# /channels — Channel Deployment Engine

## What This Does

Generates platform-importable campaign setup specs per selected channel. Every output is formatted for direct entry into the platform's interface — exact field values, not conceptual guidance.

## Trigger Context
After /traffic-strategy has selected and scored channels with budget allocations.

## Prerequisites
- Traffic Strategy document (from /traffic-strategy)
- Ad copy variations (from /deploy — Campaign Deployment Engine)
- Buyer Research Package (targeting parameters)
- Budget allocation per channel

## Execution Protocol

**DELEGATE TO SUBAGENT: \`traffic-agent\` (task_type: "channel_setup")**

### Step 0: Gather inputs
Collect and pass to subagent:
- Traffic Strategy document (\`assets/[market-name]/traffic/traffic-strategy.md\`)
- Ad copy variations (from \`/deploy\` — \`assets/[market-name]/campaigns/ad-copy.md\`)
- Buyer Research Package (targeting parameters — \`assets/[market-name]/research/buyer-research-package.md\`)
- Budget allocation per channel (from traffic strategy)
- Platform constraints (from \`assets/[market-name]/research/platform-decision.md\`)

### Step 1: Invoke traffic-agent subagent
The subagent generates platform-ready setup specs per channel. All outputs must be copy-paste ready — exact field values matching platform interface labels, not conceptual guidance.

### Step 2: Receive and save output
Save channel-specific files. For each selected channel, the subagent produces a PLATFORM-READY Setup Spec:

### Meta Ads (Facebook/Instagram) — Copy-Paste Spec:

\`\`\`
CAMPAIGN LEVEL:
  Campaign Name: [market]-[objective]-[date] (e.g., "metabolic-conversions-2026-03")
  Objective: [Sales / Leads / Traffic]
  Budget Type: [CBO / ABO]
  Daily Budget: $[exact number]
  Bid Strategy: [Highest Volume / Cost Cap $XX]

AD SET 1: [audience-label]
  Name: [market]-[audience-type]-[date]
  Audience:
    Age: [XX-XX]
    Gender: [All / Male / Female]
    Locations: [exact list]
    Detailed Targeting — Interests: [exact interest names as they appear in Meta]
    Detailed Targeting — Behaviors: [exact behavior names]
    Exclusions: [custom audience names to exclude]
  Placements: [Advantage+ / Manual: Feed, Stories, Reels]
  Budget (if ABO): $[exact number]/day
  Optimization: [Conversions / Landing Page Views / Link Clicks]

  AD 1: [hook-angle-label]
    Primary Text: [exact copy, under 125 chars for above-fold]
    Headline: [exact copy, under 40 chars]
    Description: [exact copy, under 30 chars]
    CTA Button: [Shop Now / Learn More / Sign Up / Get Offer]
    URL: [landing page URL]

  AD 2: [hook-angle-label]
    [same format]

AD SET 2: [audience-label]
  [same format, different audience]
\`\`\`

Produce 2-3 ad sets minimum. Each with 2-3 ads. All text within Meta's character limits:
- Primary text: 125 chars above fold (full text up to 500 chars)
- Headline: 40 chars
- Description: 30 chars

### Google Search Ads — Copy-Paste Spec + Importable Keyword CSV:

\`\`\`
CAMPAIGN:
  Name: [market]-search-[match-type]-[date]
  Budget: $[exact number]/day
  Bid Strategy: [Target CPA $XX / Maximize Conversions]
  Networks: Search only (no Display)
  Location: [exact locations]

AD GROUP 1: [intent-label]
  Keywords (paste directly):
    [keyword 1]
    [keyword 2]
    [keyword 3]
    ... [10-20 keywords per group]

  Negative Keywords (paste directly):
    [negative 1]
    [negative 2]
    ... [10-15 negatives]

  Responsive Search Ad:
    Headlines (provide 10-15, each under 30 chars):
      H1: [headline]
      H2: [headline]
      ... up to H15

    Descriptions (provide 4, each under 90 chars):
      D1: [description]
      D2: [description]
      D3: [description]
      D4: [description]

    Final URL: [landing page]
    Display Path: [domain.com]/[path1]/[path2]

AD GROUP 2: [intent-label]
  [same format]
\`\`\`

Additionally output a CSV-ready keyword list:
\`\`\`
Keyword, Match Type, Max CPC
"keyword one", Phrase, $X.XX
"keyword two", Exact, $X.XX
[keyword three], Broad, $X.XX
\`\`\`

### YouTube Ads — Copy-Paste Spec:

\`\`\`
CAMPAIGN:
  Name: [market]-youtube-[type]-[date]
  Type: [Video reach / Video views / Conversions]
  Budget: $[exact number]/day
  Bid Strategy: [Target CPV $X.XX / Target CPA $XX]

AD GROUP:
  Targeting:
    Custom Segments: [paste keyword list from Google Search data]
    In-Market Audiences: [exact audience names as they appear in Google Ads]
    Demographics: Age [XX-XX], Gender [All/M/F]
    Content Exclusions: [standard — embedded live streams, below-the-fold]

  VIDEO AD:
    Script (with timestamps):
      [0:00-0:05] HOOK: "[exact opening line — must stop the scroll]"
      [0:05-0:15] PROBLEM: "[agitate the pain in buyer's language]"
      [0:15-0:30] MECHANISM: "[introduce the unique mechanism]"
      [0:30-0:45] PROOF: "[credibility element]"
      [0:45-0:60] CTA: "[exact call to action with URL mention]"
    Companion Banner Headline: [under 25 chars]
    CTA Button: [Visit Site / Learn More / Sign Up]
    Final URL: [landing page]
\`\`\`

### Email / Owned Channels — Automation Spec:

\`\`\`
LEAD MAGNET FLOW:
  Entry: [landing page URL / popup / content upgrade]
  Magnet: [exact deliverable name from Product Blueprint Module 1]
  Delivery: Immediate auto-email with download link

NURTURE SEQUENCE:
  Trigger: Lead magnet download
  Email 1: [subject line] — Delay: Immediate — Purpose: Deliver + welcome
  Email 2: [subject line] — Delay: +1 day — Purpose: Story / pain agitation
  Email 3: [subject line] — Delay: +2 days — Purpose: Mechanism introduction
  Email 4: [subject line] — Delay: +4 days — Purpose: Objection handling
  Email 5: [subject line] — Delay: +6 days — Purpose: Proof / testimonial
  Email 6: [subject line] — Delay: +7 days — Purpose: Offer + urgency

AUTOMATION RULES:
  If: Opens email but doesn't click → Resend with new subject line after 24h
  If: Clicks to sales page but doesn't buy → Trigger objection-handling email
  If: Purchases → Remove from nurture, add to onboarding sequence
  If: No opens after 3 emails → Move to re-engagement segment
\`\`\`

2. **All ad copy must use Language Bank phrases** from buyer research. Flag which phrases are used where.

3. **Output:** Channel-specific setup files saved to:
   - \`assets/[market-name]/traffic/meta-setup.md\`
   - \`assets/[market-name]/traffic/google-setup.md\` + \`google-keywords.csv\`
   - \`assets/[market-name]/traffic/youtube-setup.md\`
   - \`assets/[market-name]/traffic/email-automation-setup.md\`

4. **Update pipeline-state.json** with channel deployment data.

## Autonomy
Tier 2 — Notify & Proceed for spec generation.
Tier 3 — Recommend & Wait for any budget commitment above $100/day.

## Next Step
\`/creative-test\` to begin the testing flywheel.`;
