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
const digitToLetter = ['q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

/**
 * Build a fresh letters-only unique suffix.
 * @returns Unique suffix string.
 */
export function createUniqSuffix(): string {
  return Date.now()
    .toString(26)
    .replace(/\d/g, (digit) => digitToLetter[Number(digit)] ?? 'q');
}

/**
 * Returns a compact letters-only unique suffix for the current scenario.
 * Uses the current timestamp, encoded in base-26, with digits mapped to letters.
 * @returns Unique suffix string.
 */
export function getUniqSuffix(): string {
  const envUniq = Cypress?.env?.('currentScenarioUniq');
  if (typeof envUniq === 'string' && envUniq.trim()) {
    cachedUniqSuffix = envUniq.trim();
    return cachedUniqSuffix;
  }
  if (!cachedUniqSuffix) {
    cachedUniqSuffix = createUniqSuffix();
    Cypress?.env?.('currentScenarioUniq', cachedUniqSuffix);
  }
  return cachedUniqSuffix;
}

/**
 * Reset the cached unique suffix so the next call generates a new value.
 * @example resetUniqSuffix();
 */
export function resetUniqSuffix(): void {
  cachedUniqSuffix = null;
  Cypress?.env?.('currentScenarioUniq', null);
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
