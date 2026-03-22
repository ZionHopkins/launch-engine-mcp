"""
Research report QA tests.

Validates buyer research packages, market intel reports, and scout reports.
Checks: all required sections present, data citations exist,
no contradictory claims between sections.
"""

import re
from pathlib import Path


# --- Expected sections per report type ---

SCOUT_REQUIRED_SECTIONS = [
    (r'Market\s+(?:Size|Snapshot|Overview|Seed)', 'Market Size/Overview'),
    (r'Pain\s+Signal|Competition|Competitor|Competitive', 'Competition or Pain Signals'),
    (r'Demand|Reachability|Reach|Channel', 'Demand/Reachability'),
    (r'Recommendation|Verdict|Score|PROCEED|PAUSE|KILL', 'Recommendation/Verdict'),
]

BUYER_RESEARCH_REQUIRED_SECTIONS = [
    (r'Pain\s+Architecture|Pain\s+Point|Top\s+Pain', 'Pain Architecture'),
    (r'Failed\s+Solution', 'Failed Solutions Map'),
    (r'Identity\s+Gap', 'Identity Gap'),
    (r'Language\s+Bank', 'Language Bank'),
    (r'Sophistication\s+Level', 'Sophistication Level'),
    (r'Awareness\s+Level', 'Awareness Level'),
    (r'Transformation', 'Transformation Narrative'),
]

MARKET_INTEL_REQUIRED_SECTIONS = [
    (r'Market\s+Size|TAM|Total\s+Addressable', 'Market Size'),
    (r'Competitor|Competition|Competitive\s+Landscape', 'Competitive Landscape'),
    (r'Trend|Growth|Trajectory', 'Market Trends'),
    (r'Channel|Distribution|Traffic', 'Channel/Distribution'),
    (r'Opportunity|Gap|White\s+Space', 'Opportunity/Gap'),
]

# Citation indicators (evidence the report uses actual data)
CITATION_PATTERNS = [
    r'(?:according\s+to|per|source[sd]?|data\s+from|research\s+(?:by|from|shows))',
    r'(?:reddit|amazon|forum|review|comment|post|thread)',
    r'https?://',
    r'(?:survey|study|report|statistic)',
    r'"[^"]{15,}"',  # Direct quotes (15+ chars to avoid short matches)
    r'\d{1,3}(?:,\d{3})*(?:\.\d+)?%',  # Percentage figures
    r'\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:M|B|K|million|billion|thousand))?',  # Dollar amounts
    r'(?:verbatim|exact\s+(?:quote|words)|buyer\s+(?:said|wrote|posted))',
]

# Contradiction detection pairs (if both found, may indicate inconsistency)
CONTRADICTION_PAIRS = [
    # Market size claims
    (r'(?:small|niche|limited)\s+market', r'(?:massive|huge|enormous|billion[- ]dollar)\s+market'),
    # Competition claims
    (r'(?:no|zero|minimal|low)\s+competition', r'(?:saturated|crowded|highly\s+competitive|red\s+ocean)'),
    # Demand claims
    (r'(?:no|zero|minimal|low)\s+demand', r'(?:high|strong|growing|explosive)\s+demand'),
    # Awareness claims
    (r'(?:unaware|problem[- ]unaware|level\s+1)', r'(?:most[- ]aware|level\s+5|solution[- ]aware)'),
    # Sophistication claims
    (r'(?:unsophisticated|level\s+1\s+sophistication)', r'(?:highly\s+sophisticated|level\s+5\s+sophistication)'),
]

PLACEHOLDER_PATTERNS = [
    r'\[INSERT\b',
    r'\[TODO\b',
    r'\[PLACEHOLDER\b',
    r'\[YOUR\b',
    r'lorem ipsum',
    r'\[TBD\]',
    r'\[PENDING\]',
    r'\[DATA NEEDED\]',
    r'\[RESEARCH NEEDED\]',
]


def _check_sections(content, required_sections, rel_path, report_type):
    """Check that all required sections are present."""
    results = []
    for pattern, section_name in required_sections:
        if not re.search(pattern, content, re.IGNORECASE):
            results.append({
                'test': f'{report_type}_section_{section_name.lower().replace(" ", "_")}',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Missing required section: {section_name}',
                'fix': f'Add a "{section_name}" section to the {report_type} report.',
            })
    return results


def _check_citations(content, rel_path, report_type):
    """Check that the report contains data citations / evidence."""
    results = []
    citation_count = 0
    for pattern in CITATION_PATTERNS:
        matches = re.findall(pattern, content, re.IGNORECASE)
        citation_count += len(matches)

    # Reports should have substantive evidence
    word_count = len(content.split())
    # Scale expectation: roughly 1 citation per 200 words minimum
    expected_min = max(5, word_count // 200)

    if citation_count < 3:
        results.append({
            'test': f'{report_type}_citations',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Only {citation_count} data citations/evidence markers found. Report lacks substantiation.',
            'fix': f'Add more data citations: direct buyer quotes, statistics, source references, dollar figures. Target at least {expected_min} evidence points.',
        })
    elif citation_count < expected_min:
        results.append({
            'test': f'{report_type}_citations',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'{citation_count} citations for {word_count} words is thin. Expected at least {expected_min}.',
            'fix': 'Add more direct quotes, statistics, and source references to strengthen evidence density.',
        })
    else:
        results.append({
            'test': f'{report_type}_citations',
            'status': 'PASS',
            'file': rel_path,
            'message': f'{citation_count} citations/evidence markers found.',
            'fix': None,
        })

    return results


def _is_in_table_or_distribution(content, pos):
    """Check if a match position is inside a markdown table or distribution listing."""
    # Get the line containing the match
    line_start = content.rfind('\n', 0, pos) + 1
    line_end = content.find('\n', pos)
    if line_end == -1:
        line_end = len(content)
    line = content[line_start:line_end]
    # Table rows contain pipe characters; distribution rows contain percentages
    return '|' in line or re.search(r'\d+\s*%', line)


def _check_contradictions(content, rel_path, report_type):
    """Check for contradictory claims within the same report.
    Skips matches found inside tables or distribution listings to avoid false positives."""
    results = []
    for pattern_a, pattern_b in CONTRADICTION_PAIRS:
        match_a = re.search(pattern_a, content, re.IGNORECASE)
        match_b = re.search(pattern_b, content, re.IGNORECASE)
        if match_a and match_b:
            # Skip if either match is in a table/distribution context
            if _is_in_table_or_distribution(content, match_a.start()):
                continue
            if _is_in_table_or_distribution(content, match_b.start()):
                continue
            line_a = content[:match_a.start()].count('\n') + 1
            line_b = content[:match_b.start()].count('\n') + 1
            results.append({
                'test': f'{report_type}_contradiction',
                'status': 'FAIL',
                'file': rel_path,
                'message': (
                    f'Possible contradiction: "{match_a.group()}" (line {line_a}) '
                    f'vs "{match_b.group()}" (line {line_b})'
                ),
                'fix': f'Review lines {line_a} and {line_b}. Reconcile the conflicting claims or add context explaining the nuance.',
            })
    return results


def _check_placeholders(content, rel_path, report_type):
    """Check for placeholder text."""
    results = []
    for pattern in PLACEHOLDER_PATTERNS:
        matches = list(re.finditer(pattern, content, re.IGNORECASE))
        for m in matches:
            line_num = content[:m.start()].count('\n') + 1
            results.append({
                'test': f'{report_type}_no_placeholder',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Line {line_num}: Placeholder text "{m.group()}" in {report_type} report.',
                'fix': f'Replace placeholder on line {line_num} with actual research data.',
            })
    return results


def _test_buyer_research(file_path, rel_path):
    """Test buyer research package."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 200:
        results.append({
            'test': 'buyer_research_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Buyer research file is too short. Likely incomplete.',
            'fix': 'Regenerate with /research.',
        })
        return results

    results.extend(_check_sections(content, BUYER_RESEARCH_REQUIRED_SECTIONS, rel_path, 'buyer_research'))
    results.extend(_check_citations(content, rel_path, 'buyer_research'))
    results.extend(_check_contradictions(content, rel_path, 'buyer_research'))
    results.extend(_check_placeholders(content, rel_path, 'buyer_research'))

    # Language Bank should have at least 10 entries
    # Match from "Language Bank" heading to next ## heading or end of file
    lb_match = re.search(r'Language\s+Bank(.*?)(?=^##\s[^#]|\Z)', content, re.IGNORECASE | re.DOTALL | re.MULTILINE)
    if lb_match:
        lb_content = lb_match.group(1)
        # Count: numbered entries (1. "..."), bullet items, or standalone quoted phrases
        numbered = re.findall(r'^\s*\d+[\.\)]\s+', lb_content, re.MULTILINE)
        bullets = re.findall(r'^\s*[-*]\s+', lb_content, re.MULTILINE)
        quoted = re.findall(r'"[^"]{10,}"', lb_content)
        # Deduplicate: numbered entries often contain quotes, so take the max of (numbered+bullets) vs quoted
        entry_count = max(len(numbered) + len(bullets), len(quoted))
        if entry_count < 10:
            results.append({
                'test': 'buyer_research_language_bank_size',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Language Bank has only {entry_count} entries. Minimum 10 for effective copy.',
                'fix': 'Add more buyer language phrases. Pull from Reddit, Amazon reviews, forum posts.',
            })

    # Pain Architecture should have at least 3 pain categories
    # Matches "Pain Architecture", "Pain Point", "Top Pain", etc.
    pain_match = re.search(r'Pain\s+(?:Architecture|Point|Categories?|Analysis)(.*?)(?=^##\s[^#]|\Z)', content, re.IGNORECASE | re.DOTALL | re.MULTILINE)
    if pain_match:
        pain_content = pain_match.group(1)
        # Count sub-headings (### Category Name) as pain categories
        sub_headings = re.findall(r'^###\s+(?!Why\b|How\b|Note\b|Source)', pain_content, re.MULTILINE)
        # Also count numbered top-level pain items (1. Pain Name)
        numbered_pains = re.findall(r'^\d+[\.\)]\s+\*?\*?[A-Z]', pain_content, re.MULTILINE)
        total_pains = len(sub_headings) + len(numbered_pains)
        if total_pains < 3:
            results.append({
                'test': 'buyer_research_pain_depth',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Only {total_pains} pain categories found. Need at least 3 for robust offer architecture.',
                'fix': 'Add more pain categories with buyer quotes for each.',
            })

    return results


def _test_market_intel(file_path, rel_path):
    """Test market intelligence report."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 200:
        results.append({
            'test': 'market_intel_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Market intel report is too short. Likely incomplete.',
            'fix': 'Regenerate with /market-intel.',
        })
        return results

    results.extend(_check_sections(content, MARKET_INTEL_REQUIRED_SECTIONS, rel_path, 'market_intel'))
    results.extend(_check_citations(content, rel_path, 'market_intel'))
    results.extend(_check_contradictions(content, rel_path, 'market_intel'))
    results.extend(_check_placeholders(content, rel_path, 'market_intel'))

    return results


def _test_scout_report(file_path, rel_path):
    """Test scout report."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 200:
        results.append({
            'test': 'scout_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Scout report is too short. Likely incomplete.',
            'fix': 'Regenerate with /scout.',
        })
        return results

    results.extend(_check_sections(content, SCOUT_REQUIRED_SECTIONS, rel_path, 'scout'))
    results.extend(_check_citations(content, rel_path, 'scout'))
    results.extend(_check_placeholders(content, rel_path, 'scout'))

    # Scout should have a clear PROCEED/PAUSE/KILL recommendation
    has_verdict = re.search(
        r'(?:PROCEED|PAUSE|KILL|GO|NO.GO|RECOMMENDED|NOT\s+RECOMMENDED)',
        content, re.IGNORECASE
    )
    if not has_verdict:
        results.append({
            'test': 'scout_verdict',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'No clear verdict (PROCEED/PAUSE/KILL) found in scout report.',
            'fix': 'Add a clear recommendation: PROCEED, PAUSE, or KILL with rationale.',
        })

    return results


def run_tests(asset_dir, pipeline_state=None, name_lock=None):
    """
    Run all research report tests.

    Args:
        asset_dir: Path to assets/[market-name]/ directory
        pipeline_state: Parsed pipeline state dict (optional)
        name_lock: Not used by research tests but kept for interface consistency

    Returns:
        list of test result dicts
    """
    results = []
    asset_path = Path(asset_dir)
    research_dir = asset_path / 'research'

    if not research_dir.exists():
        results.append({
            'test': 'research_dir_exists',
            'status': 'FAIL',
            'file': str(research_dir),
            'message': 'No research/ directory found.',
            'fix': 'Run /scout and /research to generate research outputs.',
        })
        return results

    # --- Scout Report ---
    scout_file = research_dir / 'scout-report.md'
    if scout_file.exists():
        rel = str(scout_file.relative_to(asset_path))
        results.extend(_test_scout_report(scout_file, rel))
    # Scout is optional in QA context (already completed earlier in pipeline)

    # --- Market Intel ---
    intel_file = research_dir / 'market-intel-report.md'
    if intel_file.exists():
        rel = str(intel_file.relative_to(asset_path))
        results.extend(_test_market_intel(intel_file, rel))

    # --- Buyer Research ---
    buyer_file = research_dir / 'buyer-research-package.md'
    if buyer_file.exists():
        rel = str(buyer_file.relative_to(asset_path))
        results.extend(_test_buyer_research(buyer_file, rel))
    else:
        results.append({
            'test': 'buyer_research_exists',
            'status': 'FAIL',
            'file': str(buyer_file.relative_to(asset_path)),
            'message': 'No buyer research package found. This is required for campaign QA.',
            'fix': 'Run /research before running QA.',
        })

    # --- Cross-report consistency ---
    # Check that awareness/sophistication levels are consistent between buyer research and building blocks
    bb_file = asset_path / 'building-blocks' / 'building-blocks.md'
    if buyer_file.exists() and bb_file.exists():
        buyer_content = buyer_file.read_text(encoding='utf-8', errors='replace')
        bb_content = bb_file.read_text(encoding='utf-8', errors='replace')

        # Extract awareness levels from both
        buyer_awareness = re.search(r'Awareness\s+Level\s*:?\s*(\d)', buyer_content, re.IGNORECASE)
        bb_awareness = re.search(r'Awareness\s*(?:Level)?\s*:?\s*(\d)', bb_content, re.IGNORECASE)

        if buyer_awareness and bb_awareness:
            if buyer_awareness.group(1) != bb_awareness.group(1):
                results.append({
                    'test': 'cross_report_awareness',
                    'status': 'FAIL',
                    'file': 'research/ + building-blocks/',
                    'message': (
                        f'Awareness level mismatch: buyer research says {buyer_awareness.group(1)}, '
                        f'building blocks says {bb_awareness.group(1)}.'
                    ),
                    'fix': 'Align awareness levels. Buyer research is the source of truth — update building blocks to match.',
                })

        # Extract sophistication levels
        buyer_soph = re.search(r'Sophistication\s+Level\s*:?\s*(\d)', buyer_content, re.IGNORECASE)
        bb_soph = re.search(r'Sophistication\s*(?:Level)?\s*:?\s*(\d)', bb_content, re.IGNORECASE)

        if buyer_soph and bb_soph:
            if buyer_soph.group(1) != bb_soph.group(1):
                results.append({
                    'test': 'cross_report_sophistication',
                    'status': 'FAIL',
                    'file': 'research/ + building-blocks/',
                    'message': (
                        f'Sophistication level mismatch: buyer research says {buyer_soph.group(1)}, '
                        f'building blocks says {bb_soph.group(1)}.'
                    ),
                    'fix': 'Align sophistication levels. Buyer research is the source of truth.',
                })

    return results
