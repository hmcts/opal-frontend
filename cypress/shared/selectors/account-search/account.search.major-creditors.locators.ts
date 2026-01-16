// shared/selectors/account-search/account.search.major-creditors.locators.ts
/**
 * @file account.search.major-creditors.locators.ts
 * @description
 * Locators for the **major creditors** search panel on the Account Search page.
 *
 * Scope:
 * - major creditors tab + panel
 */

export const AccountSearchMajorCreditorsLocators = {
  // ──────────────────────────────
  // Tab & panel
  // ──────────────────────────────
  tab: {
    majorCreditors: '#tab-major-creditors',
  },

  panel: {
    /** major creditors panel root (useful for scoping). */
    root: '#majorCreditors',
    /** Optional heading within panel, if needed. */
    heading: '#majorCreditors h1.govuk-heading-l',
  },
};
