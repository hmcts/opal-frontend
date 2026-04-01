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

  autocomplete: {
    /** Hint text rendered above the autocomplete input. */
    hint: '#fsa_search_account_major_creditors_major_creditor_id-hint',
    /** Accessible autocomplete text input. */
    input: '#fsa_search_account_major_creditors_major_creditor_id-autocomplete',
    /** Listbox shown when autocomplete suggestions are expanded. */
    listbox: '#fsa_search_account_major_creditors_major_creditor_id-autocomplete__listbox',
    /** Inline validation error rendered against the autocomplete input. */
    error: '#fsa_search_account_major_creditors_major_creditor_id-autocomplete-error-message',
  },

  businessUnitRequirement: {
    /** Message shown when more than one business unit is selected. */
    message: '#majorCreditors .govuk-body',
    /** Inline link back to the business-unit filter page. */
    link: '#majorCreditors .govuk-body > .govuk-link',
  },

  selectFallback: {
    /** Label for the underlying select element, when present. */
    label: '[for="fsa_search_account_major_creditors_major_creditor_id"]',
    /** Backing select used by the accessible autocomplete component. */
    input: '#fsa_search_account_major_creditors_major_creditor_id',
    /** Inline validation error rendered against the backing select. */
    error: '#fsa_search_account_major_creditors_major_creditor_id-error-message',
  },
};
