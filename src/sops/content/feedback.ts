export const FEEDBACK = `# /feedback — Optimizer Feedback Loop

## What This Does

Receives real-world validation data and routes iteration to the correct layer and component.

## Trigger Context
User provides real-world data: conversion rates, feedback, refund reasons, engagement metrics, testimonials, or qualitative observations.

## Execution Protocol

**DELEGATE TO SUBAGENT: \`optimizer\`**

### Step 0: Verify Prerequisites
Read \`pipeline-state.json\`. Confirm an active pipeline exists with deployed assets (at least one of: \`qa_gate.status == "complete"\`, \`validation_tier_1.status\` is not "pending", or \`traffic_agent\` has active channels). If no assets are deployed, stop:
\`\`\`
FEEDBACK BLOCKED — No deployed assets to analyze.
Complete deployment first, then return with real-world data.
\`\`\`

### Step 1: Receive the data
User pastes or describes results. Accept any format — numbers, screenshots described, qualitative feedback, email replies, survey responses, **organic data** (GSC metrics, AI citation results, content decay observations).

### Step 2: Delegate to optimizer subagent
Invoke \`optimizer\` subagent with:
1. Raw validation data from user
2. Current pipeline state (from \`pipeline-state.json\`)
3. Promise-Product Alignment Report path (from \`assets/[market-name]/product/\`)
4. All relevant asset file paths (campaigns, copy, product architecture)

The subagent will:
- Classify the signal using its 8-row diagnosis table (covers: no traffic, traffic/no signups, signups/no opens, opens/no clicks, clicks/no conversions, high refunds, low completion, everything working)
- Use the Alignment Report to pinpoint specific components
- Produce a 5-point iteration plan per issue (what to change, which file, which SOP, expected impact, measurement)
- Save validation report to \`assets/[market-name]/validation/\`

### Step 3: Process subagent output
1. Read the validation report and iteration plan from the subagent
2. Route the iteration to the correct command:
   - Layer 1 issue → \`/build-blocks\` + \`/stress-test\`
   - Layer 2 asset issue → fix specific file, re-run \`/qa\`
   - Traffic issue → \`/creative-test\`, \`/funnel-optimize\`, or \`/channels\`
   - Scale mode → \`/scale\`

### Step 4: Update pipeline-state.json
- Add iteration entry to \`iteration_history\` array with: \`{date, data_received, diagnosis, route, iteration_plan_file}\`
- Update current stage if iteration changes the pipeline position

### Step 5: Present the iteration plan
Show user: what was diagnosed, what changes are needed, which command to run next. Tier 3 — wait for user approval before executing the iteration.

## Output
Iteration routing decision. Updated files. Pipeline state updated.

## Next Step
Re-run the specific SOP that was identified as the weak link, then re-validate.`;
