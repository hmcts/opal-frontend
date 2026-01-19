/**
 * @file evidenceMode.ts
 * @description Helpers for determining whether evidence capture is enabled for the current run.
 */

/**
 * Determine whether evidence capture is enabled (legacy mode only).
 * @returns True when legacy evidence capture should run.
 */
export function isEvidenceCaptureEnabled(): boolean {
  const legacyEnabled = Cypress.env('LEGACY_ENABLED');
  if (typeof legacyEnabled === 'string' && legacyEnabled.trim()) {
    const normalized = legacyEnabled.trim().toLowerCase();
    if (normalized === 'true' || normalized === 'legacy' || normalized === '1') {
      return true;
    }
  }
  if (legacyEnabled === true) {
    return true;
  }

  const mode = String(Cypress.env('DEV_DEFAULT_APP_MODE') ?? Cypress.env('DEFAULT_APP_MODE') ?? '')
    .trim()
    .toLowerCase();
  return mode === 'legacy';
}
