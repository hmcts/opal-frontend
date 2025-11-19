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
  root: 'app-fines-sa-search, [data-testid="fines-sa-search"]',

  /** Account number input present on all tabs. */
  accountNumberInput: '#fsa_search_account_number',

  /** Reference or case number input present on all tabs. */
  referenceOrCaseNumberInput: '#fsa_search_account_reference_case_number',

  /** Global filter: "Active accounts only" checkbox (outside tab panels). */
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  /** Primary "Search" button shared by all tabs. */
  searchButton: '#submitForm',
} as const;
