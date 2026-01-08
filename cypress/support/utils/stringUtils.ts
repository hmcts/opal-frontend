/**
 * Generate a random alphanumeric string with the requested length.
 * @param length Desired number of characters.
 * @returns Randomly generated alphanumeric string.
 */
export function generateString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

let cachedUniqSuffix: string | null = null;

/**
 * Returns a compact letters-only unique suffix for the current test run.
 * Uses the current timestamp, encoded in base-26, with digits replaced by 'a'.
 * @returns Unique suffix string.
 */
export function getUniqSuffix(): string {
  if (!cachedUniqSuffix) {
    cachedUniqSuffix = Date.now().toString(26).replace(/\d/g, 'a');
  }
  return cachedUniqSuffix;
}

/**
 * Replaces `{uniq}` tokens in a string with the shared unique suffix.
 * Supports `{uniqUpper}` to use an upper-cased variant when expectations are upper-cased in the UI.
 * @param value - Input string that may contain `{uniq}` tokens.
 * @returns String with `{uniq}` tokens replaced.
 */
export function applyUniqPlaceholder(value: string): string {
  if (typeof value !== 'string') return value;
  const uniq = getUniqSuffix();
  return value.replace(/{uniqupper}/gi, uniq.toUpperCase()).replace(/{uniq}/gi, uniq);
}
