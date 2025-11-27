/**
 * @file search.filter-by-bu.common.locators.ts
 * @description
 * Shared layout + action locators for the Fines/Confiscation filter‑by‑business‑unit pages.
 */

export const SearchFilterByBUCommonLocators = {
  // ──────────────────────────────
  // Root / layout elements
  // ──────────────────────────────

  /** Root component for any filter-by-business-unit page. */
  root: 'app-fines-sa-search-filter-business-unit-form',

  /** Main page content area wrapper. */
  main: 'main[role="main"].govuk-main-wrapper',

  /** Page heading "Filter by business unit". */
  heading: 'h1.govuk-heading-l',

  /** Label that displays the count summary, e.g. "6 of 6 selected". */
  selectedCountLabel: 'app-fines-sa-search-filter-business-unit-form form > div:first-of-type',

  // ──────────────────────────────
  // Actions (buttons / links)
  // ──────────────────────────────

  /** Primary button – Save selection (n). */
  saveSelectionButton: 'button.govuk-button#submitForm',

  /** Cancel link at the bottom of the form. */
  cancelLink: 'opal-lib-govuk-cancel-link a.govuk-link.button-link',
};
