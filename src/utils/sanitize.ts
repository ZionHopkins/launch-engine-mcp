/** Remove personal paths, API keys, and identifying info from SOP content. */
export function sanitize(content: string): string {
  let result = content;

  // Strip Windows-style personal paths
  result = result.replace(/C:\\Users\\[^\\]+\\[^\s\n`"')}\]]+/g, "");
  // Strip Unix-style personal paths
  result = result.replace(/\/Users\/[^/]+\/[^\s\n`"')}\]]+/g, "");
  result = result.replace(/\/home\/[^/]+\/[^\s\n`"')}\]]+/g, "");

  // Strip HTML comments (may contain implementation hints)
  result = result.replace(/<!--[\s\S]*?-->/g, "");

  // Strip potential API keys / tokens (common patterns)
  result = result.replace(/xkeysib-[a-f0-9]+/gi, "[REDACTED_KEY]");
  result = result.replace(/sk-[a-zA-Z0-9]{20,}/g, "[REDACTED_KEY]");
  result = result.replace(/Bearer\s+[a-zA-Z0-9._-]{20,}/g, "Bearer [REDACTED]");

  // Collapse multiple blank lines left by stripping
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}
