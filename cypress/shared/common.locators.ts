/**
 * @file common.locators.ts
 * @description
 * App-wide, reusable selectors for shared UI elements (header, breadcrumbs, etc.).
 * Prefer resilient selectors; fall back to CSS only when needed.
 */
export const CommonLocators = {
  /** Primary page header. Prefer a stable test id if available. */
  header: '[data-testid="page-header"], h1[class*="govuk-heading"], h1',

  /** Logical identifier for the unsaved changes confirmation dialog */
  unsavedChangesDialog: 'window:confirm', // not an element selector — used for logging
} as const;

export type CommonLocatorKey = keyof typeof CommonLocators;
