/**
 * @file account.search.common.locators.ts
 * @description
 * Shared selectors for fields present across ALL Account Search tabs
 * (Individuals / Companies / Minor creditors / Major creditors).
 *
 * Scope:
 * - Single source of truth for global inputs & controls.
 * - Keep selectors stable (prefer IDs / data-testid).
 *
 * @example
 *   cy.get(AccountSearchCommonLocators.accountNumberInput).type('12345678A');
 *   cy.get(AccountSearchCommonLocators.referenceOrCaseNumberInput).type('CASE-001');
 *   cy.get(AccountSearchCommonLocators.searchButton).click();
 */

export const AccountSearchCommonLocators = {
  /** Root of the Search screen (any tab). Useful for scoping queries. */
  root: 'app-fines-sa-search-account, app-fines-sa-search-account-form, app-fines-sa-search, [data-testid="fines-sa-search"]',

  /** Top-level page heading for the account search form. */
  pageHeader: 'app-fines-sa-search-account-form > h1.govuk-heading-l',

  /** Global error summary shown above the search form. */
  errorSummary: 'opal-lib-govuk-error-summary, .govuk-error-summary',

  /** Summary list for the selected business unit filter. */
  businessUnitSummaryList: '[summaryListId="accountDetails"]',

  /** Optional business unit badge shown in the summary value. */
  businessUnitBadge: '.business-unit-badge',

  /** Label for the shared account number field. */
  accountNumberLabel: '[for="fsa_search_account_number"]',

  /** Account number input present on all tabs. */
  accountNumberInput: '#fsa_search_account_number',

  /** Inline validation error for account number. */
  accountNumberError: '#fsa_search_account_number-error-message',

  /** Label for the shared reference or case number field. */
  referenceOrCaseNumberLabel: '[for="fsa_search_account_reference_case_number"]',

  /** Reference or case number input present on all tabs. */
  referenceOrCaseNumberInput: '#fsa_search_account_reference_case_number',

  /** Inline validation error for reference or case number. */
  referenceOrCaseNumberError: '#fsa_search_account_reference_case_number-error-message',

  /** Global filter: "Active accounts only" checkbox (outside tab panels). */
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  /** Primary "Search" button shared by all tabs. */
  searchButton: '#submitForm',

  businessUnitFilterChangeLink: '#accountDetailsLanguagePreferencesActions a.govuk-link',
} as const;
