export const VOICE_EXTRACT = `# /voice-extract -- Brand Voice Extraction

## What This Does
Triggers the Voice Extraction Engine (VEE) to analyze all QA-passed content for a specific business and generate (or update) the brand voice calibration document. The voice doc is a per-business deliverable -- each business you run through the pipeline gets its own isolated voice document.

## When To Use
- **Auto-trigger**: The system flags when a business hits the accumulated QA-passed content threshold (default: 20 pieces). You will see: VEE READY -- [business-slug] has [N] QA-passed pieces. Run /voice-extract to generate brand voice doc.
- **Manual trigger**: Run anytime with --mode full to regenerate from scratch
- **Quarterly**: Aligns with PADA portfolio review cadence. Run --mode full to diff against existing voice doc.

## Usage
\`\`\`
/voice-extract --business [slug]
/voice-extract --business [slug] --mode full
/voice-extract --business [slug] --threshold 15
\`\`\`

## Flags
- --business (required): Business identifier. Scopes corpus, state, and output.
- --mode (optional): delta (default) = incremental update. full = complete regeneration.
- --threshold (optional): Override corpus size trigger. Default: 20.

## Prerequisites
- Therapeutic Buyer Research complete (Language Bank needed for resonance analysis)
- QA Gate has cleared content for this business (minimum threshold pieces)
- assets/[market-name]/campaigns/qa-passed/ directory populated by QA gate

## Execution Protocol

### Step 1: Validate Readiness
1. Read assets/[market-name]/voice/voice-state.json
2. Check accumulated_count against threshold
3. If below threshold and mode is delta: abort with count status
4. If mode is full: bypass threshold, run against entire corpus

### Step 2: Delegate to VEE Subagent
Invoke the Voice Extraction Engine subagent (voice-extraction-engine.md) with:
- business_slug
- mode (delta or full)
- Path to QA-passed content directory
- Path to existing voice doc (if any)
- Path to voice state file

The subagent runs the full 6-phase extraction protocol in isolation:
1. Corpus Collection
2. Pattern Extraction (4 layers: Structural, Lexical, Rhetorical, Resonance)
3. Delta Detection (delta mode only)
4. Confidence Scoring
5. Document Generation/Update
6. Branch Analysis

### Step 3: Receive and Save Outputs
VEE returns:
- brand-voice-[business-slug].md -- the voice calibration document
- Updated voice-state.json -- reset accumulator, increment cycle, update pattern history

Save to:
\`\`\`
assets/[market-name]/voice/
  brand-voice-[business-slug].md
  voice-state.json
\`\`\`

### Step 4: Update Pipeline State
Update pipeline-state.json:
- Set voice_extraction.status to complete
- Record extraction date, mode, corpus size, cycle number
- Record voice doc path

### Step 5: Present Results
\`\`\`
VOICE EXTRACTION COMPLETE -- [business-slug]

Mode: [delta | full]
Extraction cycle: [N]
Corpus analyzed: [N] pieces ([N] active | [N] passive)

HIGH confidence patterns: [N]
MEDIUM confidence patterns: [N]
OBSERVATIONS (not yet codified): [N]

[If delta mode:]
  New patterns added: [N]
  Patterns reinforced: [N]
  Patterns shifting: [N] (see drift log)
  Patterns decayed: [N] (flagged for review)

[If full mode with previous version:]
  Persisted: [N] | Changed: [N] | Disappeared: [N] | Emerged: [N]

Voice doc saved: assets/[market-name]/voice/brand-voice-[business-slug].md

This doc is a transferable asset -- hand it to any copywriter, agency, or AI tool
to maintain voice consistency for this business.
\`\`\`

## Autonomy
Tier 1 -- Full Auto for extraction and document generation.
Tier 2 -- Notify and Proceed when voice doc is first generated (new capability for this business).

## Output
Brand voice calibration document (.md) + updated voice state (.json).

## Next Step
No mandatory next step. Voice doc feeds into future asset creation cycles as calibration input.
Optional: Review the voice doc and provide feedback to refine patterns.

## Quarterly Integration
When running quarterly reviews:
1. Run /voice-extract --business [slug] --mode full for each active business
2. Review DIFF REPORT for voice evolution patterns
3. Major divergences surface in pipeline-report.md
4. Aligns with PADA quarterly portfolio review cadence`;
