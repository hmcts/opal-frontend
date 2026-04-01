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
    root: '#minorCreditors',
    /** Optional heading within panel, if needed. */
    heading: '#minorCreditors h1.govuk-heading-l',
  },

  // ──────────────────────────────
  // Type selector (radios in a fieldset)
  // ──────────────────────────────
  type: {
    fieldset: '#fsa_search_account_minor_creditors_minor_creditor_type',
    /** Radio: Individual */
    individualRadio: '#fsa_search_account_minor_creditors_minor_creditor_type-individual',
    /** Radio: Company */
    companyRadio: '#fsa_search_account_minor_creditors_minor_creditor_type-company',
    /** Optional: if a select is ever used instead of radios */
    selectFallback: 'select#fsa_search_account_minor_creditors_minor_creditor_type',
    /** Conditional wrapper that reveals the Individual fields */
    individualConditional: '#fsa_search_account_minor_creditors_minor_creditor_type_individual',
    /** Conditional wrapper that reveals the Company fields */
    companyConditional: '#fsa_search_account_minor_creditors_minor_creditor_type_company',
  },

  // ──────────────────────────────
  // Individual sub-form fields (within conditional)
  // ──────────────────────────────
  individual: {
    lastNameLabel: '[for="fsa_search_account_minor_creditors_last_name"]',
    lastNameInput: '#fsa_search_account_minor_creditors_last_name',
    lastNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_last_name_exact_match',
    lastNameError: '#fsa_search_account_minor_creditors_last_name-error-message',

    firstNamesLabel: '[for="fsa_search_account_minor_creditors_first_names"]',
    firstNamesInput: '#fsa_search_account_minor_creditors_first_names',
    firstNamesExactMatchCheckbox: '#fsa_search_account_minor_creditors_first_names_exact_match',
    firstNamesError: '#fsa_search_account_minor_creditors_first_names-error-message',

    addressLine1Label: '[for="fsa_search_account_minor_creditors_individual_address_line_1"]',
    addressLine1Input: '#fsa_search_account_minor_creditors_individual_address_line_1',
    addressLine1Error: '#fsa_search_account_minor_creditors_individual_address_line_1-error-message',

    postcodeLabel: '[for="fsa_search_account_minor_creditors_individual_post_code"]',
    postcodeInput: '#fsa_search_account_minor_creditors_individual_post_code',
    postcodeError: '#fsa_search_account_minor_creditors_individual_post_code-error-message',
  },

  // ──────────────────────────────
  // Company sub-form fields (within conditional)
  // ──────────────────────────────
  company: {
    companyNameLabel: '[for="fsa_search_account_minor_creditors_company_name"]',
    companyNameInput: '#fsa_search_account_minor_creditors_company_name',
    companyNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_company_name_exact_match',
    companyNameError: '#fsa_search_account_minor_creditors_company_name-error-message',

    companyAddressLine1Label: '[for="fsa_search_account_minor_creditors_company_address_line_1"]',
    companyAddressLine1Input: '#fsa_search_account_minor_creditors_company_address_line_1',
    companyAddressLine1Error: '#fsa_search_account_minor_creditors_company_address_line_1-error-message',

    companyPostcodeLabel: '[for="fsa_search_account_minor_creditors_company_post_code"]',
    companyPostcodeInput: '#fsa_search_account_minor_creditors_company_post_code',
    companyPostcodeError: '#fsa_search_account_minor_creditors_company_post_code-error-message',
  },
} as const;

export type AccountSearchMinorCreditorsLocatorKeys = keyof typeof AccountSearchMinorCreditorsLocators;
