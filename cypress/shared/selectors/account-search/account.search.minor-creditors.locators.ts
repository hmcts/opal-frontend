// shared/selectors/account-search/account.search.minor-creditors.locators.ts
/**
 * @file account.search.minor-creditors.locators.ts
 * @description
 * Locators for the **Minor creditors** search panel on the Account Search page.
 *
 * Scope:
 * - Minor creditors tab + panel
 * - Type selector (Individual / Company)
 * - Individual sub-form fields (last/first names, exact-match checkboxes, address line 1, postcode)
 * - Company sub-form fields (company name, exact-match checkbox, address line 1, postcode)
 *
 * Notes:
 * - Cross-panel/common controls (Account number, Reference or case number, Active accounts only, Search button)
 *   live in account.search.common.locators.ts.
 */

export const AccountSearchMinorCreditorsLocators = {
  // ──────────────────────────────
  // Tab & panel
  // ──────────────────────────────
  tab: {
    minorCreditors: '#tab-minor-creditors',
  },

  panel: {
    /** Minor creditors panel root (useful for scoping). */
    root: '#minor-creditors',
    /** Optional heading within panel, if needed. */
    heading: '#minor-creditors h1.govuk-heading-l',
  },

  // ──────────────────────────────
  // Type selector (radios in a fieldset)
  // ──────────────────────────────
  type: {
    fieldset: '#fsa_search_account_minor_creditors_minor_creditor_type',
    /** Radio: Individual */
    individualRadio: '#individual',
    /** Radio: Company */
    companyRadio: '#company',
    /** Optional: if a select is ever used instead of radios */
    selectFallback: 'select#fsa_search_account_minor_creditors_minor_creditor_type',
    /** Conditional wrapper that reveals the Individual fields */
    individualConditional: '#fsa_search_account_minor_creditors_minor_creditor_type-conditional',
  },

  // ──────────────────────────────
  // Individual sub-form fields (within conditional)
  // ──────────────────────────────
  individual: {
    lastNameInput: '#fsa_search_account_minor_creditors_last_name',
    lastNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_last_name_exact_match',

    firstNamesInput: '#fsa_search_account_minor_creditors_first_names',
    firstNamesExactMatchCheckbox: '#fsa_search_account_minor_creditors_first_names_exact_match',

    addressLine1Input: '#fsa_search_account_minor_creditors_individual_address_line_1',
    postcodeInput: '#fsa_search_account_minor_creditors_individual_post_code',
  },

  // ──────────────────────────────
  // Company sub-form fields (within conditional)
  // ──────────────────────────────
  company: {
    companyNameInput: '#fsa_search_account_minor_creditors_company_name',
    companyNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_company_name_exact_match',

    companyAddressLine1Input: '#fsa_search_account_minor_creditors_company_address_line_1',
    companyPostcodeInput: '#fsa_search_account_minor_creditors_company_post_code',
  },
} as const;

export type AccountSearchMinorCreditorsLocatorKeys = keyof typeof AccountSearchMinorCreditorsLocators;
