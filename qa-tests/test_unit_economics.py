"""
Unit economics QA tests.

Validates unit-economics.md math: margins > 0, CAC < LTV,
numbers internally consistent, required financial sections present.
"""

import re
from pathlib import Path


REQUIRED_SECTIONS = [
    (r'Revenue\s+Model|Pricing|Revenue', 'Revenue Model'),
    (r'(?:Customer\s+)?Acquisition\s+(?:Economics|Cost)|CAC|CPA', 'Customer Acquisition Economics'),
    (r'(?:Financial\s+)?Guardrail|Kill\s+Threshold|Budget\s+Cap', 'Financial Guardrails'),
    (r'Verdict|Conclusion|Recommendation|Viability', 'Verdict'),
]

PLACEHOLDER_PATTERNS = [
    r'\[INSERT\b',
    r'\[TODO\b',
    r'\[TBD\]',
    r'\[CALCULATE\]',
    r'\[PENDING\]',
]


def _extract_dollar_values(text):
    """Extract all dollar values from text as (label_context, float_value, original_string) tuples."""
    values = []
    # Match: $50, $1,200, $2.5K, $10M, $1,234.56
    pattern = r'(\$\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s*(?:K|M|B|k|m|b))?)'
    for match in re.finditer(pattern, text):
        raw = match.group(1)
        # Get surrounding context (30 chars before) for labeling
        start = max(0, match.start() - 60)
        context = text[start:match.start()].strip().split('\n')[-1].strip()

        # Parse numeric value
        num_str = raw.replace('$', '').replace(',', '').strip()
        multiplier = 1
        if num_str[-1].upper() == 'K':
            multiplier = 1_000
            num_str = num_str[:-1]
        elif num_str[-1].upper() == 'M':
            multiplier = 1_000_000
            num_str = num_str[:-1]
        elif num_str[-1].upper() == 'B':
            multiplier = 1_000_000_000
            num_str = num_str[:-1]

        try:
            val = float(num_str) * multiplier
            values.append((context, val, raw))
        except ValueError:
            pass

    return values


def _extract_percentages(text):
    """Extract all percentage values as (label_context, float_value, original_string) tuples."""
    values = []
    pattern = r'(\d{1,3}(?:\.\d+)?)\s*%'
    for match in re.finditer(pattern, text):
        start = max(0, match.start() - 60)
        context = text[start:match.start()].strip().split('\n')[-1].strip()
        try:
            val = float(match.group(1))
            values.append((context, val, match.group(0)))
        except ValueError:
            pass
    return values


def _find_labeled_value(content, label_patterns):
    """Find a dollar value associated with a label pattern."""
    for pattern in label_patterns:
        # First find the label, then search for a dollar value near it
        label_match = re.search(pattern, content, re.IGNORECASE)
        if not label_match:
            continue
        # Search in the 200 chars after the label for a dollar value
        search_start = label_match.end()
        search_region = content[search_start:search_start + 200]
        val_match = re.search(r'\$\s*([\d,]+(?:\.\d+)?)\s*([KkMmBb])?', search_region)
        if not val_match:
            # Try without dollar sign if preceded by colon/pipe
            val_match = re.search(r'[:\|]\s*([\d,]+(?:\.\d+)?)\s*([KkMmBb])?', search_region)
        if val_match:
            num_str = val_match.group(1).replace(',', '').strip()
            suffix = val_match.group(2)
            multiplier = 1
            if suffix and suffix.upper() == 'K':
                multiplier = 1_000
            elif suffix and suffix.upper() == 'M':
                multiplier = 1_000_000
            elif suffix and suffix.upper() == 'B':
                multiplier = 1_000_000_000
            try:
                return float(num_str) * multiplier
            except ValueError:
                pass
    return None


def run_tests(asset_dir, pipeline_state=None, name_lock=None):
    """
    Run all unit economics tests.

    Args:
        asset_dir: Path to assets/[market-name]/ directory
        pipeline_state: Parsed pipeline state dict (optional, used for cross-validation)
        name_lock: Not used but kept for interface consistency

    Returns:
        list of test result dicts
    """
    results = []
    asset_path = Path(asset_dir)

    ue_file = asset_path / 'research' / 'unit-economics.md'
    if not ue_file.exists():
        results.append({
            'test': 'unit_economics_exists',
            'status': 'FAIL',
            'file': 'research/unit-economics.md',
            'message': 'No unit economics file found.',
            'fix': 'Run /unit-economics to generate the financial analysis.',
        })
        return results

    content = ue_file.read_text(encoding='utf-8', errors='replace')
    rel_path = 'research/unit-economics.md'

    if len(content.strip()) < 200:
        results.append({
            'test': 'unit_economics_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Unit economics file is too short. Likely incomplete.',
            'fix': 'Regenerate with /unit-economics.',
        })
        return results

    # --- Required sections ---
    for pattern, section_name in REQUIRED_SECTIONS:
        if not re.search(pattern, content, re.IGNORECASE):
            results.append({
                'test': f'ue_section_{section_name.lower().replace(" ", "_")}',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Missing required section: {section_name}',
                'fix': f'Add a "{section_name}" section to the unit economics report.',
            })

    # --- Placeholders ---
    for pattern in PLACEHOLDER_PATTERNS:
        matches = list(re.finditer(pattern, content, re.IGNORECASE))
        for m in matches:
            line_num = content[:m.start()].count('\n') + 1
            results.append({
                'test': 'ue_no_placeholder',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Line {line_num}: Placeholder "{m.group()}" in unit economics.',
                'fix': f'Replace placeholder on line {line_num} with calculated values.',
            })

    # --- Extract key financial metrics ---
    ltv = _find_labeled_value(content, [
        r'Total\s+LTV',
        r'(?:Client|Customer)\s+Lifetime\s+Value\s*\(LTV\)',
        r'Lifetime\s+Value',
    ])

    cac = _find_labeled_value(content, [
        r'Target\s+CAC',
        r'Customer\s+Acquisition\s+Cost',
        r'Cost\s+(?:Per|To)\s+Acqui(?:re|sition)',
    ])

    cpa = _find_labeled_value(content, [
        r'Target\s+CPA',
        r'Cost\s+Per\s+(?:Acquisition|Action|Application)',
    ])

    price = _find_labeled_value(content, [
        r'Price|Pricing|Product\s+Price',
        r'Package\s+(?:Price|Cost)',
        r'Offer\s+Price',
    ])

    gross_margin_pct = None
    margin_patterns = [r'Gross\s+Margin', r'Margin']
    for mp in margin_patterns:
        m = re.search(mp + r'[:\s|]*(\d{1,3}(?:\.\d+)?)\s*%', content, re.IGNORECASE)
        if m:
            gross_margin_pct = float(m.group(1))
            break

    # --- Validate: Margins > 0 ---
    if gross_margin_pct is not None:
        if gross_margin_pct <= 0:
            results.append({
                'test': 'ue_margin_positive',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Gross margin is {gross_margin_pct}%. Must be positive for a viable business.',
                'fix': 'Review COGS and pricing. Either reduce costs or increase price.',
            })
        elif gross_margin_pct < 30:
            results.append({
                'test': 'ue_margin_healthy',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Gross margin is {gross_margin_pct}%. Below 30% makes profitable customer acquisition difficult.',
                'fix': 'Consider increasing price, reducing COGS, or restructuring the offer for higher margins.',
            })
        else:
            results.append({
                'test': 'ue_margin_positive',
                'status': 'PASS',
                'file': rel_path,
                'message': f'Gross margin is {gross_margin_pct}%.',
                'fix': None,
            })

    # --- Validate: CAC < LTV ---
    effective_cac = cac or cpa
    if ltv is not None and effective_cac is not None:
        if effective_cac >= ltv:
            results.append({
                'test': 'ue_cac_lt_ltv',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'CAC/CPA (${effective_cac:,.0f}) >= LTV (${ltv:,.0f}). Business loses money per customer.',
                'fix': 'Reduce acquisition costs or increase LTV (higher price, upsells, longer retention).',
            })
        elif effective_cac > ltv * 0.5:
            results.append({
                'test': 'ue_cac_lt_ltv',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'CAC/CPA (${effective_cac:,.0f}) is more than 50% of LTV (${ltv:,.0f}). Thin margin for profit.',
                'fix': 'Aim for CAC below 33% of LTV. Optimize funnel or increase customer value.',
            })
        else:
            ratio = effective_cac / ltv * 100
            results.append({
                'test': 'ue_cac_lt_ltv',
                'status': 'PASS',
                'file': rel_path,
                'message': f'CAC/CPA is {ratio:.0f}% of LTV. Healthy ratio.',
                'fix': None,
            })
    elif ltv is None and effective_cac is None:
        results.append({
            'test': 'ue_key_metrics_present',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Could not extract LTV or CAC/CPA values. Key metrics may be missing or formatted unusually.',
            'fix': 'Ensure LTV and CAC/CPA are clearly labeled with dollar values (e.g., "LTV: $5,000", "Target CPA: $150").',
        })

    # --- Validate: Price consistency ---
    if price is not None and ltv is not None:
        if ltv < price:
            # LTV should be >= price (could be equal for one-time, higher for recurring)
            results.append({
                'test': 'ue_ltv_gte_price',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'LTV (${ltv:,.0f}) is less than product price (${price:,.0f}). Math error.',
                'fix': 'LTV should be >= price. Check if LTV calculation includes all revenue (upsells, renewals).',
            })

    # --- Validate: Percentages are reasonable ---
    percentages = _extract_percentages(content)
    for context, val, raw in percentages:
        if val > 100:
            line_matches = [i + 1 for i, line in enumerate(content.split('\n')) if raw in line]
            line_ref = f' (line {line_matches[0]})' if line_matches else ''
            # Skip if it's clearly a growth rate or multiplier context
            if not re.search(r'(?:growth|increase|roi|return|roas)', context, re.IGNORECASE):
                results.append({
                    'test': 'ue_percentage_valid',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'Percentage > 100%{line_ref}: {raw} — context: "...{context[-40:]}"',
                    'fix': f'Verify the {raw} figure. If it\'s a rate (conversion, margin), it should be 0-100%.',
                })

    # --- Validate: Has a clear verdict ---
    verdict_match = re.search(
        r'(?:VIABLE|NON[- ]?VIABLE|GO|NO[- ]?GO|PROCEED|KILL)',
        content, re.IGNORECASE
    )
    if not verdict_match:
        results.append({
            'test': 'ue_verdict',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'No clear viability verdict found (VIABLE/NON-VIABLE/GO/NO-GO).',
            'fix': 'Add a clear verdict: VIABLE or NON-VIABLE with supporting rationale.',
        })
    else:
        results.append({
            'test': 'ue_verdict',
            'status': 'PASS',
            'file': rel_path,
            'message': f'Verdict found: {verdict_match.group()}',
            'fix': None,
        })

    # --- Cross-validate with pipeline state ---
    if pipeline_state:
        ue_state = None
        layer_1 = pipeline_state.get('layer_1', {})
        if isinstance(layer_1, dict):
            ue_state = layer_1.get('unit_economics', {})

        if ue_state and isinstance(ue_state, dict):
            state_ltv = ue_state.get('ltv')
            if state_ltv is not None and ltv is not None:
                # Allow 20% tolerance for rounding differences
                if abs(state_ltv - ltv) / max(state_ltv, ltv, 1) > 0.20:
                    results.append({
                        'test': 'ue_state_consistency',
                        'status': 'FAIL',
                        'file': rel_path,
                        'message': (
                            f'LTV in document (${ltv:,.0f}) differs from pipeline-state.json '
                            f'(${state_ltv:,.0f}) by more than 20%.'
                        ),
                        'fix': 'Align the LTV figure in the document with pipeline-state.json, or update the state.',
                    })

    return results
