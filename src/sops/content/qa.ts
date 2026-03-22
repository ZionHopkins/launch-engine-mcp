export const QA = `# /qa — Persona Alignment Gate

## What This Does

Stress-tests all customer-facing content against the validated buyer persona. Flags misalignment across 7 dimensions, auto-corrects issues, re-validates, and produces a clearance verdict. Nothing enters the deployment pipeline without passing this gate.

## Trigger Context
Three activation modes:

**AUTO MODE** — Runs automatically after \`/deploy\` completes, before \`/validate-prep\` generates the deployment package. This is the primary gate.

**MANUAL MODE** — User types \`/qa\` to run on any existing assets. Useful after manual edits or when iterating on specific pieces.

**CREATIVE MODE** — Auto-runs on new creative batches from \`/creative-test\` MODE 1 before they enter the testing flywheel. Prevents spending money testing misaligned creatives.

## Prerequisites
- Therapeutic Buyer Research Package (from /research): Pain Architecture, Failed Solutions Map, Identity Gap, Language Bank, Sophistication Level, Awareness Level, Transformation Narrative
- Copy Directives (from /stress-test GO verdict)
- Building Blocks (from /build-blocks)
- Campaign assets to audit (from /deploy, /creative-test, or /funnel-optimize)

## Execution Protocol

**DELEGATE TO SUBAGENT: \`persona-qa\`**

### Step 1: Load All Inputs

Gather from pipeline assets:
\`\`\`
FROM buyer research:  assets/[market-name]/research/buyer-research-package.md
FROM building blocks: assets/[market-name]/building-blocks/building-blocks.md
FROM stress test:     assets/[market-name]/building-blocks/stress-test-report.md (Copy Directives section)
FROM campaigns:       assets/[market-name]/campaigns/* (all customer-facing assets)
\`\`\`

If running in CREATIVE MODE, also load:
\`\`\`
FROM creative tests:  assets/[market-name]/traffic/creative-tests/batch-[N]/*
\`\`\`

### Step 2: Invoke Persona QA Subagent

Pass the complete package to the persona-qa subagent. The subagent runs 7 alignment checks on every customer-facing asset:

1. **Language Alignment** — Does the copy use the buyer's words or the builder's?
2. **Awareness Level Match** — Does the approach match how aware this market is?
3. **Sophistication Level Match** — Does the copy respect how many solutions they've seen?
4. **Pain Architecture Alignment** — Does it address root pain in priority order?
5. **Failed Solutions Integration** — Does it acknowledge what they've tried and why it failed?
6. **Identity Gap Bridge** — Does the transformation narrative match their specific gap?
7. **Promise Authorization Audit** — Does every claim stay within Copy Directives?

**Optional Check 8: Technical/SEO Structure Alignment** — runs only when \`organic_growth.content_engine.status == "complete"\` in pipeline state OR the selected platform supports organic traffic. This check is **ADVISORY only** (non-blocking). It verifies:
- H1 contains primary keyword
- H2s framed as questions (featured snippet optimization)
- FAQ section present with question-as-header format
- Meta descriptions present and under 160 chars
- First 200 words contain stat + value prop + brand name

### Step 3: Receive QA Report + Corrected Assets

The subagent returns:
- Full QA report with per-asset scores and per-check breakdowns
- Auto-corrected versions of all flagged assets
- Clearance verdict: CLEARED / CLEARED WITH CONDITIONS / BLOCKED

### Step 4: Apply Corrections

**If CLEARED:**
- Replace original assets with corrected versions in \`assets/[market-name]/campaigns/\`
- Archive originals as \`[filename]-pre-qa.[ext]\` for reference
- Save QA report to \`assets/[market-name]/campaigns/qa-report.md\`
- Update pipeline-state.json with QA status
- Proceed to \`/validate-prep\` (or back to \`/creative-test\` in creative mode)

**If CLEARED WITH CONDITIONS:**
- Present the accepted risks to user
- Apply all auto-corrections
- Document which MODERATE flags were accepted and why
- Tier 2 — Notify & Proceed (conditions are documented, not blocking)
- Proceed to \`/validate-prep\`

**If BLOCKED:**
- Present all CRITICAL flags with current vs. corrected versions
- Tier 3 — Recommend & Wait
- User reviews corrected versions and approves
- If corrections are insufficient (fundamental Building Block problem): route to \`/feedback\` for Building Block revision, then re-run \`/deploy\` → \`/qa\`
- Do NOT proceed to deployment until CRITICAL flags are resolved

### Step 5: Capture Alignment Patterns

After QA completes, extract learnings for the pattern library:

\`\`\`
Auto-capture to /lessons:
- Which checks scored lowest (recurring weakness to address in future pipelines)
- Which Language Bank phrases appeared most effective in corrected versions
- Whether the awareness/sophistication level assessment was accurate
- Any systematic pattern in the types of corrections needed
\`\`\`

### Step 6: Post-QA Verification (AUTO-EXECUTE — Tier 1)

**Final structural check after persona corrections.** The persona-qa subagent may have edited assets during correction — this re-run verifies those edits didn't break structural integrity (introduce placeholder text, push subject lines over length, break HTML, etc.).

**Execute immediately using Bash:**
\`\`\`bash
python qa-tests/qa_runner.py [market-slug] --module landing_page --module campaign_assets --json-out assets/[market-name]/campaigns/qa-post-correction.json
\`\`\`

Note: research_report and unit_economics modules are NOT re-run here — they were already validated pre-deploy and persona QA doesn't touch those files.

**If exit code is 0:** proceed to Step 7.

**If exit code is 1:** fix directly (Tier 1 — auto-fix structural issues introduced by persona corrections). Re-run. Max 3 iterations.

**If iterations exhaust:** present remaining failures to user as Tier 3.

### Step 7: VEE Handoff (CLEARED/CLEARED WITH CONDITIONS only)

The persona-qa subagent handles this automatically:
- Archives cleared assets to \`assets/[market-name]/campaigns/qa-passed/\` with metadata
- Initializes voice state if first QA pass for this business
- Increments VEE accumulation counter
- Flags VEE readiness when threshold is reached

If VEE READY appears in the QA report, inform the user:
\`\`\`
Voice Extraction Engine ready. Run /voice-extract --business [slug] to generate brand voice doc.
\`\`\`

### Step 8: Update Pipeline State

\`\`\`json
{
  "qa_gate": {
    "status": "complete",
    "completed_at": "[timestamp]",
    "verdict": "[cleared/cleared_with_conditions/blocked]",
    "overall_score": "[X/35]",
    "checks": {
      "language_alignment": "[X/5]",
      "awareness_match": "[X/5]",
      "sophistication_match": "[X/5]",
      "pain_alignment": "[X/5]",
      "failed_solutions": "[X/5]",
      "identity_gap": "[X/5]",
      "promise_authorization": "[X/5]"
    },
    "corrections_applied": {
      "critical": "[N]",
      "moderate": "[N]",
      "minor": "[N]"
    },
    "seo_structure": {
      "ran": true,
      "advisory_flags": "[N]",
      "h1_keyword": "[pass/fail]",
      "h2_questions": "[pass/fail]",
      "faq_present": "[pass/fail]",
      "meta_descriptions": "[pass/fail]",
      "first_200_words": "[pass/fail]"
    },
    "assets_cleared": ["[list of cleared asset filenames]"],
    "output_file": "assets/[market-name]/campaigns/qa-report.md"
  }
}
\`\`\`

## Integration Points

### With /deploy (Primary Gate — AUTO MODE)
\`\`\`
/deploy completes → /qa runs automatically → if CLEARED → /validate-prep
                                            → if BLOCKED → fix → re-run /qa
\`\`\`

### With /creative-test (Creative Gate — CREATIVE MODE)
\`\`\`
/creative-test MODE 1 generates batch → /qa runs on batch → if CLEARED → batch enters testing
                                                            → if BLOCKED → correct → re-check
\`\`\`

### With /funnel-optimize (Variation Gate — MANUAL MODE)
\`\`\`
/funnel-optimize generates test variation → /qa runs on variation → if CLEARED → enter A/B test
                                                                   → if BLOCKED → correct
\`\`\`

### With /feedback (Escalation Path)
\`\`\`
/qa BLOCKED + corrections insufficient → /feedback → diagnose Building Block issue
  → /build-blocks revision → /stress-test → /deploy → /qa (full cycle)
\`\`\`

### With /voice-extract (Voice Extraction Sidecar)
\`\`\`
/qa CLEARED → Phase 7 archives to qa-passed/ → accumulator increments
  → threshold hit → VEE READY flagged in report → user runs /voice-extract
  → brand voice doc generated → feeds into future asset creation cycles
\`\`\`

## Autonomy
Tier 1 — Full Auto for running the audit and applying corrections.
Tier 2 — Notify & Proceed for CLEARED and CLEARED WITH CONDITIONS verdicts.
Tier 3 — Recommend & Wait for BLOCKED verdicts (user must approve resolution path).

## Output
QA Report + corrected assets saved to campaigns folder. Pipeline state updated.

## Next Step
CLEARED → \`/validate-prep\` (auto-mode) or back to calling command (creative/manual mode)
CLEARED → \`campaigns/qa-passed/\` is now the canonical deploy source for the Asset Executor agent. The full \`assets/[market-name]/\` directory can be handed to the executor for deployment.
BLOCKED → Fix path presented, then re-run \`/qa\``;
