"""
Landing page QA tests.

Validates both .md and .html landing pages in campaigns/ and validation/tier-1/.
Checks: HTML validity, CTA presence, mobile meta tags, no exposed API keys,
link format validation.
"""

import os
import re
from pathlib import Path
from html.parser import HTMLParser


# --- Secret patterns (high-confidence only to avoid false positives) ---

SECRET_PATTERNS = [
    # Actual key values assigned in code — not variable names or env references
    (r'''(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key)\s*[:=]\s*["'][a-zA-Z0-9_\-]{20,}["']''',
     "Hardcoded secret value"),
    # Common provider key formats
    (r'sk-[a-zA-Z0-9]{20,}', "OpenAI/Stripe secret key"),
    (r'sk_live_[a-zA-Z0-9]{20,}', "Stripe live secret key"),
    (r'sk_test_[a-zA-Z0-9]{20,}', "Stripe test secret key"),
    (r'xkeysib-[a-zA-Z0-9]{20,}', "Brevo/Sendinblue API key"),
    (r'tvly-[a-zA-Z0-9]{20,}', "Tavily API key"),
    (r'AIza[a-zA-Z0-9_\-]{35}', "Google API key"),
    (r'ghp_[a-zA-Z0-9]{36}', "GitHub personal access token"),
    (r'apify_api_[a-zA-Z0-9]{20,}', "Apify API token"),
]

# Patterns that look like keys but are safe (env var references, placeholders)
SAFE_PATTERNS = [
    r'process\.env\.',
    r'\{\{.*\}\}',
    r'\$\{.*\}',
    r'YOUR_.*_HERE',
    r'REPLACE_WITH_',
    r'<your[_-]',
    r'xxx+',
    r'\.env',
    r'import\.meta\.env',
]

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
]

CTA_PATTERNS_MD = [
    r'(?i)\bapply\s+now\b',
    r'(?i)\bget\s+started\b',
    r'(?i)\bbook\s+(a\s+)?call\b',
    r'(?i)\bschedule\s+(a\s+)?(call|consultation|session)\b',
    r'(?i)\bstart\s+(your|my)\b',
    r'(?i)\bjoin\s+(now|today|the)\b',
    r'(?i)\bsign\s+up\b',
    r'(?i)\bsubscribe\b',
    r'(?i)\bdownload\b',
    r'(?i)\bclaim\s+(your|my)\b',
    r'(?i)\breserve\s+(your|my)\b',
    r'(?i)\benroll\b',
    r'(?i)\block\s+in\b',
    r'(?i)\bsecure\s+(your|my)\b',
    r'(?i)\bbuy\s+now\b',
    r'(?i)\border\s+now\b',
    r'(?i)\bget\s+access\b',
    r'(?i)\byes[,!]?\s+i\s+(want|need)\b',
]

CTA_PATTERNS_HTML = CTA_PATTERNS_MD + [
    r'<button\b',
    r'<a\b[^>]*class="[^"]*(?:btn|button|cta)[^"]*"',
    r'<a\b[^>]*href=[^>]*>.*?(?:apply|start|book|join|sign|subscribe|get)',
    r'<input\b[^>]*type="submit"',
]

MOBILE_META_TAGS = [
    r'<meta\s+name="viewport"',
    r'<meta\s+content="[^"]*width=device-width',
]


class HTMLStructureParser(HTMLParser):
    """Lightweight HTML parser to check structure without external deps."""

    def __init__(self):
        super().__init__()
        self.errors = []
        self.tag_stack = []
        self.has_doctype = False
        self.has_head = False
        self.has_body = False
        self.has_title = False
        self.has_charset = False
        self.links = []
        self.self_closing = {
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
            'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
        }

    def handle_decl(self, decl):
        if decl.lower().startswith('doctype'):
            self.has_doctype = True

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        attrs_dict = dict(attrs)

        if tag == 'head':
            self.has_head = True
        elif tag == 'body':
            self.has_body = True
        elif tag == 'title':
            self.has_title = True
        elif tag == 'meta':
            charset = attrs_dict.get('charset', '')
            content = attrs_dict.get('content', '')
            if charset or 'charset=' in content.lower():
                self.has_charset = True
        elif tag == 'a':
            href = attrs_dict.get('href', '')
            if href and not href.startswith(('#', 'mailto:', 'tel:', 'javascript:')):
                self.links.append(href)

        if tag not in self.self_closing:
            self.tag_stack.append(tag)

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.self_closing:
            return
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
        elif tag in self.tag_stack:
            # Mismatched nesting
            idx = len(self.tag_stack) - 1 - self.tag_stack[::-1].index(tag)
            unclosed = self.tag_stack[idx + 1:]
            if unclosed:
                self.errors.append(
                    f"Mismatched tags: <{tag}> closed but <{', '.join(unclosed)}> still open"
                )
            self.tag_stack = self.tag_stack[:idx]


def _is_safe_match(line, match_text):
    """Check if a secret-pattern match is actually a safe reference."""
    for safe in SAFE_PATTERNS:
        if re.search(safe, line, re.IGNORECASE):
            return True
    return False


def run_tests(asset_dir, pipeline_state=None, name_lock=None):
    """
    Run all landing page tests.

    Args:
        asset_dir: Path to assets/[market-name]/ directory
        pipeline_state: Parsed pipeline state dict for this market (optional)
        name_lock: Parsed name lock registry data (optional)

    Returns:
        list of test result dicts: {test, status, file, message, fix}
    """
    results = []
    asset_path = Path(asset_dir)

    # Find all landing page files
    landing_pages = []
    for pattern in [
        'campaigns/landing-page.md',
        'campaigns/qa-passed/landing-page.md',
        'campaigns/qa-passed/landing-page.html',
        'validation/tier-1/landing-page.html',
        'copy/landing-page.md',
    ]:
        found = asset_path / pattern
        if found.exists():
            landing_pages.append(found)

    if not landing_pages:
        results.append({
            'test': 'landing_page_exists',
            'status': 'FAIL',
            'file': str(asset_path / 'campaigns/landing-page.md'),
            'message': 'No landing page file found in campaigns/, qa-passed/, validation/tier-1/, or copy/',
            'fix': 'Run /deploy to generate the landing page before QA.',
        })
        return results

    for lp_file in landing_pages:
        rel_path = str(lp_file.relative_to(asset_path))
        content = lp_file.read_text(encoding='utf-8', errors='replace')
        is_html = lp_file.suffix == '.html'

        # --- Test: Not empty ---
        if len(content.strip()) < 100:
            results.append({
                'test': 'landing_page_not_empty',
                'status': 'FAIL',
                'file': rel_path,
                'message': f'Landing page is too short ({len(content.strip())} chars). Likely incomplete.',
                'fix': 'Regenerate the landing page with /deploy. Minimum viable page is 500+ words.',
            })
            continue

        # --- Test: No exposed secrets ---
        lines = content.split('\n')
        for line_num, line in enumerate(lines, 1):
            for pattern, label in SECRET_PATTERNS:
                match = re.search(pattern, line, re.IGNORECASE)
                if match and not _is_safe_match(line, match.group()):
                    results.append({
                        'test': 'no_exposed_secrets',
                        'status': 'FAIL',
                        'file': rel_path,
                        'message': f'Line {line_num}: Possible {label} detected: "{match.group()[:40]}..."',
                        'fix': f'Remove the hardcoded secret on line {line_num}. Use environment variables or a backend proxy instead.',
                    })

        # --- Test: No placeholder text ---
        for pattern in PLACEHOLDER_PATTERNS:
            matches = list(re.finditer(pattern, content, re.IGNORECASE))
            for m in matches:
                line_num = content[:m.start()].count('\n') + 1
                results.append({
                    'test': 'no_placeholder_text',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'Line {line_num}: Placeholder text found: "{m.group()}"',
                    'fix': f'Replace placeholder on line {line_num} with actual content from Building Blocks or buyer research.',
                })

        # --- Test: CTA exists ---
        cta_found = False
        patterns = CTA_PATTERNS_HTML if is_html else CTA_PATTERNS_MD
        for p in patterns:
            if re.search(p, content):
                cta_found = True
                break
        if not cta_found:
            results.append({
                'test': 'cta_exists',
                'status': 'FAIL',
                'file': rel_path,
                'message': 'No clear call-to-action found in the landing page.',
                'fix': 'Add a CTA (e.g., "Apply Now", "Book a Call", "Get Started") that matches the offer structure from Building Blocks.',
            })
        else:
            results.append({
                'test': 'cta_exists',
                'status': 'PASS',
                'file': rel_path,
                'message': 'CTA found.',
                'fix': None,
            })

        # --- HTML-specific tests ---
        if is_html:
            parser = HTMLStructureParser()
            try:
                parser.feed(content)
            except Exception as e:
                results.append({
                    'test': 'html_parseable',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'HTML parsing error: {e}',
                    'fix': 'Fix the HTML syntax error. Run the content through an HTML validator.',
                })
                continue

            # Structure errors
            for err in parser.errors:
                results.append({
                    'test': 'html_structure',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': err,
                    'fix': 'Fix the tag nesting. Ensure every opening tag has a matching closing tag.',
                })

            if not parser.has_doctype:
                results.append({
                    'test': 'html_doctype',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': 'Missing <!DOCTYPE html> declaration.',
                    'fix': 'Add <!DOCTYPE html> as the first line of the file.',
                })

            if not parser.has_head:
                results.append({
                    'test': 'html_head',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': 'Missing <head> section.',
                    'fix': 'Add a <head> section with title, charset, and viewport meta tags.',
                })

            if not parser.has_title:
                results.append({
                    'test': 'html_title',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': 'Missing <title> tag.',
                    'fix': 'Add a <title> tag inside <head> with the product/offer name.',
                })

            if not parser.has_charset:
                results.append({
                    'test': 'html_charset',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': 'Missing charset declaration.',
                    'fix': 'Add <meta charset="UTF-8"> inside <head>.',
                })

            # Mobile meta tags
            has_viewport = any(re.search(p, content, re.IGNORECASE) for p in MOBILE_META_TAGS)
            if not has_viewport:
                results.append({
                    'test': 'mobile_viewport',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': 'Missing viewport meta tag for mobile responsiveness.',
                    'fix': 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside <head>.',
                })
            else:
                results.append({
                    'test': 'mobile_viewport',
                    'status': 'PASS',
                    'file': rel_path,
                    'message': 'Viewport meta tag present.',
                    'fix': None,
                })

            # Unclosed tags at end
            if parser.tag_stack:
                unclosed = [t for t in parser.tag_stack if t not in ('html', 'head', 'body')]
                if unclosed:
                    results.append({
                        'test': 'html_unclosed_tags',
                        'status': 'FAIL',
                        'file': rel_path,
                        'message': f'Unclosed tags at end of document: {", ".join(unclosed)}',
                        'fix': f'Add closing tags for: {", ".join(f"</{t}>" for t in reversed(unclosed))}',
                    })

            # Link format validation (not resolution — no network calls)
            for link in parser.links:
                if link.startswith('http://') and 'localhost' not in link:
                    results.append({
                        'test': 'link_https',
                        'status': 'FAIL',
                        'file': rel_path,
                        'message': f'Insecure HTTP link found: {link}',
                        'fix': f'Change "{link}" to use HTTPS.',
                    })
                if re.match(r'^https?://$', link) or link in ('http://', 'https://'):
                    results.append({
                        'test': 'link_not_empty',
                        'status': 'FAIL',
                        'file': rel_path,
                        'message': f'Empty/stub link found: {link}',
                        'fix': 'Replace the empty href with the actual destination URL.',
                    })

        # --- Markdown-specific tests ---
        else:
            # Check for heading structure
            headings = re.findall(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE)
            if len(headings) < 3:
                results.append({
                    'test': 'md_heading_structure',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'Only {len(headings)} headings found. Landing page needs clear section structure.',
                    'fix': 'Ensure the landing page has distinct sections: headline, problem, mechanism, offer, guarantee, CTA.',
                })

            # Check minimum word count (landing pages should be substantive)
            words = len(content.split())
            if words < 300:
                results.append({
                    'test': 'md_word_count',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'Landing page has only {words} words. Too short for a conversion page.',
                    'fix': 'Expand the landing page. A conversion-focused page typically needs 500-2000+ words covering problem, mechanism, offer, proof, and CTA.',
                })

        # --- Brand name consistency (if name_lock provided) ---
        if name_lock:
            product_name = name_lock.get('product_name', '')
            if product_name and product_name not in content:
                results.append({
                    'test': 'brand_name_present',
                    'status': 'FAIL',
                    'file': rel_path,
                    'message': f'Locked product name "{product_name}" not found in landing page.',
                    'fix': f'Ensure the product name "{product_name}" appears in the headline and key sections per the Name Lock Registry.',
                })

    # If no failures were recorded, add a summary pass
    fail_count = sum(1 for r in results if r['status'] == 'FAIL')
    if fail_count == 0:
        results.append({
            'test': 'landing_page_all_checks',
            'status': 'PASS',
            'file': 'all landing pages',
            'message': f'All {len(landing_pages)} landing page(s) passed all checks.',
            'fix': None,
        })

    return results
