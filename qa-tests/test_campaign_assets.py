"""
Campaign asset QA tests.

Validates email sequences, ad copy, and application/signup forms.
Checks: word counts, brand name consistency, no placeholder text,
email subject line length, ad variation structure.
"""

import re
from pathlib import Path


PLACEHOLDER_PATTERNS = [
    r'\[INSERT\b',
    r'\[TODO\b',
    r'\[PLACEHOLDER\b',
    r'\[YOUR\b',
    r'lorem ipsum',
    r'\[BRAND NAME\]',
    r'\[PRODUCT NAME\]',
    r'\[COMPANY NAME\]',
    r'\[MECHANISM NAME\]',
    r'\[CLIENT NAME\]',
    r'\[HEADLINE HERE\]',
    r'\[CTA HERE\]',
    r'\[SUBJECT LINE\]',
    r'\[FIRST NAME\]',  # should use merge tag syntax like {{first_name}}
    r'\[EMAIL\]',
]

MAX_SUBJECT_LINE_LENGTH = 60  # industry best practice
MIN_SUBJECT_LINE_LENGTH = 10

# Email sequence expected structure
EMAIL_HEADER_PATTERN = re.compile(r'^##\s+Email\s+(\d+)', re.MULTILINE | re.IGNORECASE)
SUBJECT_LINE_PATTERN = re.compile(r'\*\*Subject\s*(?:line)?\*\*\s*:\s*(.+)', re.IGNORECASE)
SEND_TIMING_PATTERN = re.compile(r'\*\*Send\s*timing\*\*\s*:\s*(.+)', re.IGNORECASE)

# Ad copy expected structure (supports both **Bold** and ### Heading formats)
AD_VARIATION_PATTERN = re.compile(r'^##\s+Ad\s+Variation\s+(\d+)', re.MULTILINE | re.IGNORECASE)
AD_PRIMARY_TEXT_PATTERN = re.compile(r'(?:\*\*|###?\s+)Primary\s+Text', re.IGNORECASE)
AD_HEADLINE_PATTERN = re.compile(r'(?:\*\*|###?\s+)Headline', re.IGNORECASE)
AD_CTA_PATTERN = re.compile(r'(?:\*\*|###?\s+)CTA\s*(?:Button)?', re.IGNORECASE)


def _check_placeholders(content, rel_path, asset_type):
    """Check for placeholder text in any asset."""
    results = []
    for pattern in PLACEHOLDER_PATTERNS:
        matches = list(re.finditer(pattern, content, re.IGNORECASE))
        for m in matches:
            line_num = content[:m.start()].count('\n') + 1
            results.append({
                'test': f'{asset_type}_no_placeholder',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Line {line_num}: Placeholder text "{m.group()}" in {asset_type}.',
                'fix': f'Replace placeholder on line {line_num} with actual content.',
            })
    return results


def _check_brand_consistency(content, rel_path, asset_type, name_lock):
    """Check that locked brand names appear consistently."""
    results = []
    if not name_lock:
        return results

    product_name = name_lock.get('product_name', '')
    if product_name and product_name not in content:
        results.append({
            'test': f'{asset_type}_brand_name',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Locked product name "{product_name}" not found in {asset_type}.',
            'fix': f'Include the product name "{product_name}" per the Name Lock Registry.',
        })

    mechanism_name = name_lock.get('mechanism_name', '')
    if mechanism_name and mechanism_name not in content:
        results.append({
            'test': f'{asset_type}_mechanism_name',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Locked mechanism name "{mechanism_name}" not found in {asset_type}.',
            'fix': f'Reference the mechanism "{mechanism_name}" to maintain brand consistency.',
        })

    return results


def _test_email_sequence(file_path, rel_path, name_lock):
    """Test a single email sequence file."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 100:
        results.append({
            'test': 'email_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Email sequence file is too short. Likely incomplete.',
            'fix': 'Regenerate the email sequence with /deploy.',
        })
        return results

    # Check email count
    emails = EMAIL_HEADER_PATTERN.findall(content)
    if len(emails) < 3:
        results.append({
            'test': 'email_count',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Only {len(emails)} emails found. Minimum 3 for a nurture sequence.',
            'fix': 'Add more emails to the sequence. Standard is 5-7 emails over 7-14 days.',
        })
    else:
        results.append({
            'test': 'email_count',
            'status': 'PASS',
            'file': rel_path,
            'message': f'{len(emails)} emails found.',
            'fix': None,
        })

    # Check subject lines
    subject_lines = SUBJECT_LINE_PATTERN.findall(content)
    for i, subject in enumerate(subject_lines, 1):
        subject = subject.strip().strip('"').strip("'")
        if len(subject) > MAX_SUBJECT_LINE_LENGTH:
            results.append({
                'test': 'email_subject_length',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Email {i} subject line is {len(subject)} chars (max {MAX_SUBJECT_LINE_LENGTH}): "{subject}"',
                'fix': f'Shorten email {i} subject to {MAX_SUBJECT_LINE_LENGTH} chars or less. Mobile preview cuts off around 35-40 chars.',
            })
        elif len(subject) < MIN_SUBJECT_LINE_LENGTH:
            results.append({
                'test': 'email_subject_length',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Email {i} subject line is only {len(subject)} chars: "{subject}". Too short to be meaningful.',
                'fix': f'Expand email {i} subject line to be more descriptive and compelling.',
            })

    if not subject_lines:
        results.append({
            'test': 'email_subject_exists',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'No subject lines found in email sequence.',
            'fix': 'Add **Subject line**: to each email section.',
        })

    # Check send timing present
    timings = SEND_TIMING_PATTERN.findall(content)
    if len(timings) < len(emails):
        results.append({
            'test': 'email_timing',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Only {len(timings)} send timings for {len(emails)} emails. Each email needs timing.',
            'fix': 'Add **Send timing**: to each email specifying delay from trigger or previous email.',
        })

    # Per-email word count (each email body should be 100-600 words)
    email_sections = re.split(r'^##\s+Email\s+\d+', content, flags=re.MULTILINE | re.IGNORECASE)
    for i, section in enumerate(email_sections[1:], 1):  # skip preamble
        words = len(section.split())
        if words < 50:
            results.append({
                'test': 'email_body_length',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Email {i} body is only {words} words. Too short.',
                'fix': f'Expand email {i} to at least 100 words. Each email should deliver value, not just tease.',
            })
        elif words > 800:
            results.append({
                'test': 'email_body_length',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Email {i} body is {words} words. Too long for email — readers will drop off.',
                'fix': f'Trim email {i} to under 600 words. Move excess content to landing page or future email.',
            })

    # Placeholders and brand
    results.extend(_check_placeholders(content, rel_path, 'email'))
    results.extend(_check_brand_consistency(content, rel_path, 'email', name_lock))

    return results


def _test_ad_copy(file_path, rel_path, name_lock):
    """Test a single ad copy file."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 100:
        results.append({
            'test': 'ad_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Ad copy file is too short. Likely incomplete.',
            'fix': 'Regenerate ad copy with /deploy.',
        })
        return results

    # Check ad variation count
    variations = AD_VARIATION_PATTERN.findall(content)
    if len(variations) < 2:
        results.append({
            'test': 'ad_variation_count',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Only {len(variations)} ad variation(s). Need at least 2 for testing.',
            'fix': 'Add more ad variations with distinct angles (pain-lead, mechanism-lead, social proof, etc.).',
        })
    else:
        results.append({
            'test': 'ad_variation_count',
            'status': 'PASS',
            'file': rel_path,
            'message': f'{len(variations)} ad variations found.',
            'fix': None,
        })

    # Check each variation has required components
    ad_sections = re.split(r'^##\s+Ad\s+Variation\s+\d+', content, flags=re.MULTILINE | re.IGNORECASE)
    for i, section in enumerate(ad_sections[1:], 1):
        if not AD_PRIMARY_TEXT_PATTERN.search(section):
            results.append({
                'test': 'ad_primary_text',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Ad variation {i} missing **Primary Text** section.',
                'fix': f'Add **Primary Text** to ad variation {i}.',
            })

        if not AD_HEADLINE_PATTERN.search(section):
            results.append({
                'test': 'ad_headline',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Ad variation {i} missing **Headline** section.',
                'fix': f'Add **Headline** to ad variation {i}.',
            })

        if not AD_CTA_PATTERN.search(section):
            results.append({
                'test': 'ad_cta',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Ad variation {i} missing **CTA Button** section.',
                'fix': f'Add **CTA Button** to ad variation {i} (e.g., Learn More, Apply Now, Sign Up).',
            })

        # Primary text word count (Facebook: 125 char primary, but we use long-form)
        words = len(section.split())
        if words < 30:
            results.append({
                'test': 'ad_variation_length',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Ad variation {i} is only {words} words total. Too thin.',
                'fix': f'Expand ad variation {i} with more compelling copy.',
            })

    # Placeholders and brand
    results.extend(_check_placeholders(content, rel_path, 'ad'))
    results.extend(_check_brand_consistency(content, rel_path, 'ad', name_lock))

    return results


def _test_form(file_path, rel_path, name_lock):
    """Test application/signup form."""
    results = []
    content = file_path.read_text(encoding='utf-8', errors='replace')

    if len(content.strip()) < 50:
        results.append({
            'test': 'form_not_empty',
            'status': 'FAIL',
            'file': rel_path,
            'message': 'Form file is too short. Likely incomplete.',
            'fix': 'Regenerate the form with /deploy.',
        })
        return results

    # Check question count
    questions = re.findall(r'^##\s+Question\s+(\d+)', content, re.MULTILINE | re.IGNORECASE)
    if len(questions) < 3:
        results.append({
            'test': 'form_question_count',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'Only {len(questions)} questions. Minimum 3 for qualification.',
            'fix': 'Add more qualifying questions to filter leads effectively.',
        })
    elif len(questions) > 15:
        results.append({
            'test': 'form_question_count',
            'status': 'FAIL',
            'file': rel_path,
            'message': f'{len(questions)} questions is too many. Completion rate drops sharply after 7-8.',
            'fix': 'Reduce to 7-10 questions max. Keep only high-signal qualification questions.',
        })
    else:
        results.append({
            'test': 'form_question_count',
            'status': 'PASS',
            'file': rel_path,
            'message': f'{len(questions)} questions.',
            'fix': None,
        })

    # Check each question has type specified
    question_sections = re.split(r'^##\s+Question\s+\d+', content, flags=re.MULTILINE | re.IGNORECASE)
    for i, section in enumerate(question_sections[1:], 1):
        has_question = re.search(r'\*\*Question\*\*\s*:', section, re.IGNORECASE)
        has_type = re.search(r'\*\*Type\*\*\s*:', section, re.IGNORECASE)
        if not has_question:
            results.append({
                'test': 'form_question_text',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Question {i} missing **Question**: field.',
                'fix': f'Add the actual question text to Question {i}.',
            })
        if not has_type:
            results.append({
                'test': 'form_question_type',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Question {i} missing **Type**: field (single select, multi-select, text, etc.).',
                'fix': f'Specify the input type for Question {i}.',
            })

    # Placeholders
    results.extend(_check_placeholders(content, rel_path, 'form'))

    return results


def run_tests(asset_dir, pipeline_state=None, name_lock=None):
    """
    Run all campaign asset tests.

    Args:
        asset_dir: Path to assets/[market-name]/ directory
        pipeline_state: Parsed pipeline state dict (optional)
        name_lock: Dict with product_name, mechanism_name, etc. (optional)

    Returns:
        list of test result dicts
    """
    results = []
    asset_path = Path(asset_dir)

    # --- Email Sequences ---
    email_files = []
    for pattern in [
        'campaigns/email-sequence.md',
        'campaigns/qa-passed/email-sequence.md',
        'copy/email-sequence.md',
    ]:
        f = asset_path / pattern
        if f.exists():
            email_files.append(f)

    if not email_files:
        results.append({
            'test': 'email_exists',
            'status': 'FAIL',
            'file': str(asset_path / 'campaigns/email-sequence.md'),
            'message': 'No email sequence file found.',
            'fix': 'Run /deploy to generate the email sequence.',
        })
    else:
        for ef in email_files:
            rel = str(ef.relative_to(asset_path))
            results.extend(_test_email_sequence(ef, rel, name_lock))

    # --- Ad Copy ---
    ad_files = []
    for pattern in [
        'campaigns/ad-copy.md',
        'campaigns/qa-passed/ad-copy.md',
    ]:
        f = asset_path / pattern
        if f.exists():
            ad_files.append(f)

    if not ad_files:
        results.append({
            'test': 'ad_exists',
            'status': 'FAIL',
            'file': str(asset_path / 'campaigns/ad-copy.md'),
            'message': 'No ad copy file found.',
            'fix': 'Run /deploy to generate ad copy.',
        })
    else:
        for af in ad_files:
            rel = str(af.relative_to(asset_path))
            results.extend(_test_ad_copy(af, rel, name_lock))

    # --- Application / Signup Form ---
    form_files = []
    for name in ['application-form.md', 'signup-form.md', 'profile-upload-form.md']:
        for subdir in ['campaigns', 'campaigns/qa-passed']:
            f = asset_path / subdir / name
            if f.exists():
                form_files.append(f)

    # Forms are optional (some products use direct checkout)
    for ff in form_files:
        rel = str(ff.relative_to(asset_path))
        results.extend(_test_form(ff, rel, name_lock))

    return results
