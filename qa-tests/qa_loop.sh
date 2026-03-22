#!/usr/bin/env bash
# qa_loop.sh — Automated QA loop with Claude-powered fix iterations.
#
# Runs qa_runner.py against a market's assets. If tests fail, feeds the
# failure report to Claude Code with instructions to fix the specific files,
# then re-runs tests. Repeats up to MAX_ITERATIONS or until all tests pass.
#
# Usage:
#   bash qa-tests/qa_loop.sh <market-slug>
#   bash qa-tests/qa_loop.sh <market-slug> --max-iterations 3
#
# Requires: python3, claude (Claude Code CLI)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QA_RUNNER="$SCRIPT_DIR/qa_runner.py"

MAX_ITERATIONS=5
MARKET=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --max-iterations)
            MAX_ITERATIONS="$2"
            shift 2
            ;;
        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            MARKET="$1"
            shift
            ;;
    esac
done

if [[ -z "$MARKET" ]]; then
    echo "Usage: bash qa-tests/qa_loop.sh <market-slug> [--max-iterations N]"
    exit 1
fi

ASSET_DIR="$PROJECT_ROOT/assets/$MARKET"
if [[ ! -d "$ASSET_DIR" ]]; then
    echo "ERROR: Asset directory not found: $ASSET_DIR"
    exit 1
fi

REPORT_DIR="$ASSET_DIR/campaigns"
mkdir -p "$REPORT_DIR"

echo "============================================================"
echo "  QA LOOP — $MARKET"
echo "  Max iterations: $MAX_ITERATIONS"
echo "============================================================"
echo ""

ITERATION=0
while [[ $ITERATION -lt $MAX_ITERATIONS ]]; do
    ITERATION=$((ITERATION + 1))
    REPORT_FILE="$REPORT_DIR/qa-auto-report-iter-${ITERATION}.json"

    echo "--- Iteration $ITERATION of $MAX_ITERATIONS ---"
    echo "Running QA tests..."

    # Run tests and capture report
    set +e
    python "$QA_RUNNER" "$MARKET" --json-out "$REPORT_FILE" 2>&1
    EXIT_CODE=$?
    set -e

    if [[ $EXIT_CODE -eq 0 ]]; then
        echo ""
        echo "ALL TESTS PASSED on iteration $ITERATION."
        echo "Report: $REPORT_FILE"

        # Clean up intermediate reports, keep final
        for i in $(seq 1 $((ITERATION - 1))); do
            rm -f "$REPORT_DIR/qa-auto-report-iter-${i}.json"
        done

        # Rename final report
        mv "$REPORT_FILE" "$REPORT_DIR/qa-auto-report-final.json"
        echo "Final report: $REPORT_DIR/qa-auto-report-final.json"
        exit 0
    fi

    echo "Tests failed. Failures found in report."

    if [[ $ITERATION -ge $MAX_ITERATIONS ]]; then
        echo ""
        echo "MAX ITERATIONS ($MAX_ITERATIONS) reached. Some tests still failing."
        echo "Final report: $REPORT_FILE"
        echo ""
        echo "Remaining failures:"
        python -c "
import json, sys
with open('$REPORT_FILE') as f:
    report = json.load(f)
for fail in report.get('failures', []):
    print(f'  [{fail[\"test\"]}] {fail[\"file\"]}: {fail[\"message\"]}')
"
        exit 1
    fi

    # Build fix prompt from failure report
    echo "Sending failures to Claude for auto-fix..."

    PROMPT=$(python -c "
import json, sys
with open('$REPORT_FILE') as f:
    report = json.load(f)

failures = report.get('failures', [])
if not failures:
    sys.exit(0)

lines = []
lines.append('The following QA test failures were found in the assets for market \"$MARKET\".')
lines.append('Fix each issue by editing the specific files. Do NOT rewrite entire files — make targeted edits only.')
lines.append('The asset directory is: $ASSET_DIR')
lines.append('')
lines.append('FAILURES TO FIX:')
lines.append('')

for i, f in enumerate(failures, 1):
    lines.append(f'{i}. [{f[\"test\"]}] File: {f[\"file\"]}')
    lines.append(f'   Issue: {f[\"message\"]}')
    if f.get('fix'):
        lines.append(f'   Fix: {f[\"fix\"]}')
    lines.append('')

lines.append('RULES:')
lines.append('- Only fix the specific issues listed above')
lines.append('- Do not add new content beyond what is needed to fix the failure')
lines.append('- Do not change content that is not related to a failure')
lines.append('- Preserve the existing structure and formatting of each file')
lines.append('- If a fix requires information from other pipeline files (buyer research, building blocks), read those files first')

print('\n'.join(lines))
")

    if [[ -z "$PROMPT" ]]; then
        echo "No failures to fix. Exiting."
        exit 0
    fi

    # Run Claude in headless mode to fix the issues
    claude -p "$PROMPT" \
        --allowedTools "Read,Edit,Write,Glob,Grep" \
        --max-turns 30 \
        2>&1 | tail -20

    echo ""
    echo "Fixes applied. Re-running tests..."
    echo ""
done
