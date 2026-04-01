/**
 * @file auth-environment.actions.ts
 * @description Shared Cypress helpers for auth environment detection.
 */

/**
 * Returns the configured Cypress base URL as a string.
 *
 * @returns Configured Cypress base URL, or an empty string when unset.
 */
export function getConfiguredBaseUrl(): string {
  return String(Cypress.config('baseUrl') ?? '');
}

/**
 * Determines whether the current test is running against a local or PR environment.
 *
 * @returns True when the configured base URL points to localhost or a PR environment.
 */
export function isLocalOrPrEnvironment(): boolean {
  const baseUrl = getConfiguredBaseUrl();
  return baseUrl.includes('pr-') || baseUrl.includes('localhost');
}
