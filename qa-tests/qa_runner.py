"""
QA Runner — discovers and runs all QA test modules against a market's assets.

Usage:
    python qa-tests/qa_runner.py <market-slug>
    python qa-tests/qa_runner.py <market-slug> --module landing_page
    python qa-tests/qa_runner.py <market-slug> --json-out report.json

Produces a structured JSON report with pass/fail results and fix instructions.
"""

import argparse
import importlib
import json
import os
import sys
from datetime import datetime
from pathlib import Path


# Project root (parent of qa-tests/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJECT_ROOT / 'assets'
PIPELINE_STATE_FILE = PROJECT_ROOT / 'pipeline-state.json'

# Test modules to discover and run
TEST_MODULES = [
    'test_landing_page',
    'test_campaign_assets',
    'test_research_report',
    'test_unit_economics',
]


def load_pipeline_state(market_slug):
    """Load pipeline state for a specific market."""
    if not PIPELINE_STATE_FILE.exists():
        return None

    try:
        with open(PIPELINE_STATE_FILE, 'r', encoding='utf-8') as f:
            state = json.load(f)
    except (json.JSONDecodeError, IOError):
        return None

    # Check in pipelines
    pipelines = state.get('pipelines', {})
    if market_slug in pipelines:
        return pipelines[market_slug]

    # Check rapid_tests
    rapid = state.get('rapid_tests', {})
    if market_slug in rapid:
        return rapid[market_slug]

    return None


def load_name_lock(asset_dir):
    """Load name lock data from the market's building-blocks directory."""
    name_lock_file = Path(asset_dir) / 'building-blocks' / 'name-lock-registry.md'
    if not name_lock_file.exists():
        return None

    content = name_lock_file.read_text(encoding='utf-8', errors='replace')

    import re
    name_lock = {}

    # Extract locked names — format: **PRODUCT NAME**: Assetpath
    product = re.search(r'(?:PRODUCT\s+NAME|Product\s+Name)\s*\**\s*[:\-|]\s*(.+)', content, re.IGNORECASE)
    if product:
        name_lock['product_name'] = product.group(1).strip().strip('*').strip('"').strip("'").strip()

    mechanism = re.search(r'(?:MECHANISM\s+NAME|Mechanism\s+Name)\s*\**\s*[:\-|]\s*(.+)', content, re.IGNORECASE)
    if mechanism:
        name_lock['mechanism_name'] = mechanism.group(1).strip().strip('*').strip('"').strip("'").strip()

    tagline = re.search(r'(?:TAGLINE|Tagline)\s*\**\s*[:\-|]\s*(.+)', content, re.IGNORECASE)
    if tagline:
        name_lock['tagline'] = tagline.group(1).strip().strip('*').strip('"').strip("'").strip()

    return name_lock if name_lock else None


def run_all_tests(market_slug, module_filter=None):
    """
    Run all test modules against a market's assets.

    Args:
        market_slug: Market directory name under assets/
        module_filter: Optional list of module names to run (without test_ prefix)

    Returns:
        dict with summary and detailed results
    """
    asset_dir = ASSETS_DIR / market_slug

    if not asset_dir.exists():
        return {
            'market': market_slug,
            'timestamp': datetime.now().isoformat(),
            'status': 'ERROR',
            'error': f'Asset directory not found: {asset_dir}',
            'summary': {'total': 0, 'passed': 0, 'failed': 0},
            'results': [],
        }

    # Load context
    pipeline_state = load_pipeline_state(market_slug)
    name_lock = load_name_lock(str(asset_dir))

    all_results = []
    modules_run = []

    # Add qa-tests/ to path for imports
    qa_tests_dir = str(Path(__file__).resolve().parent)
    if qa_tests_dir not in sys.path:
        sys.path.insert(0, qa_tests_dir)

    for module_name in TEST_MODULES:
        # Apply filter
        short_name = module_name.replace('test_', '')
        if module_filter and short_name not in module_filter:
            continue

        try:
            mod = importlib.import_module(module_name)
            results = mod.run_tests(
                str(asset_dir),
                pipeline_state=pipeline_state,
                name_lock=name_lock,
            )
            all_results.extend(results)
            modules_run.append(module_name)
        except Exception as e:
            all_results.append({
                'test': f'{module_name}_import',
                'status': 'ERROR',
                'file': module_name,
                'message': f'Module error: {e}',
                'fix': f'Check {module_name}.py for syntax or import errors.',
            })

    # Build summary
    passed = sum(1 for r in all_results if r['status'] == 'PASS')
    failed = sum(1 for r in all_results if r['status'] == 'FAIL')
    errors = sum(1 for r in all_results if r['status'] == 'ERROR')
    total = len(all_results)

    overall_status = 'PASS' if failed == 0 and errors == 0 else 'FAIL'

    report = {
        'market': market_slug,
        'timestamp': datetime.now().isoformat(),
        'status': overall_status,
        'summary': {
            'total': total,
            'passed': passed,
            'failed': failed,
            'errors': errors,
        },
        'modules_run': modules_run,
        'failures': [r for r in all_results if r['status'] == 'FAIL'],
        'errors_list': [r for r in all_results if r['status'] == 'ERROR'],
        'passes': [r for r in all_results if r['status'] == 'PASS'],
        'results': all_results,
    }

    return report


def print_report(report):
    """Print a human-readable summary of the report."""
    status = report['status']
    s = report['summary']
    market = report['market']

    status_icon = 'PASSED' if status == 'PASS' else 'FAILED'
    print(f'\n{"=" * 60}')
    print(f'  QA REPORT — {market}')
    print(f'  Status: {status_icon}')
    print(f'  Tests: {s["total"]} total | {s["passed"]} passed | {s["failed"]} failed | {s.get("errors", 0)} errors')
    print(f'  Modules: {", ".join(report.get("modules_run", []))}')
    print(f'{"=" * 60}\n')

    if report.get('error'):
        print(f'  ERROR: {report["error"]}\n')
        return

    if report['failures']:
        print('  FAILURES:')
        print('  ' + '-' * 56)
        for f in report['failures']:
            print(f'  [{f["test"]}] {f["file"]}')
            print(f'    {f["message"]}')
            if f.get('fix'):
                print(f'    FIX: {f["fix"]}')
            print()

    if report.get('errors_list'):
        print('  ERRORS:')
        print('  ' + '-' * 56)
        for e in report['errors_list']:
            print(f'  [{e["test"]}] {e["message"]}')
            print()

    if status == 'PASS':
        print('  All checks passed.\n')


def main():
    parser = argparse.ArgumentParser(description='Run QA tests against a market\'s assets')
    parser.add_argument('market', help='Market slug (directory name under assets/)')
    parser.add_argument('--module', '-m', action='append', dest='modules',
                        help='Only run specific module(s): landing_page, campaign_assets, research_report, unit_economics')
    parser.add_argument('--json-out', '-o', help='Write JSON report to this file')
    parser.add_argument('--json', action='store_true', help='Print JSON report to stdout')

    args = parser.parse_args()

    report = run_all_tests(args.market, module_filter=args.modules)

    if args.json_out:
        out_path = Path(args.json_out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        print(f'Report written to {args.json_out}')

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print_report(report)

    # Exit code: 0 if all pass, 1 if any failures
    sys.exit(0 if report['status'] == 'PASS' else 1)


if __name__ == '__main__':
    main()
