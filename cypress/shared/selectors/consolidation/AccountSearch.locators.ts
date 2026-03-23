export const AccountSearchLocators = {
  heading: 'h1.govuk-heading-l',

  // Summary rows
  summaryList: '#consolidateAccSummary',
  businessUnitKey: '#consolidateAccSummaryBusinessUnitKey',
  businessUnitValue: '#consolidateAccSummaryBusinessUnitValue',
  defendantTypeKey: '#consolidateAccSummaryDefendantTypeKey',
  defendantTypeValue: '#consolidateAccSummaryDefendantTypeValue',

  // Consolidation tabs
  tabsNav: 'opal-lib-moj-sub-navigation#consolidate-acc-tabs, nav.moj-sub-navigation#consolidate-acc-tabs',
  searchTab: 'li[subnavitemid="search-tab"] > .moj-sub-navigation__link',
  searchTabLink: 'li[subnavitemid="search-tab"] > .moj-sub-navigation__link',
  resultsTab: 'li[subnavitemid="results-tab"] > .moj-sub-navigation__link',
  forConsolidationTab: 'li[subnavitemid="for-consolidation-tab"] > .moj-sub-navigation__link',

  // Search guidance and headings
  quickSearchHint: 'p.govuk-body.govuk-dark-grey-text-colour.govuk-\\!-margin-top-0',
  quickSearchHeading: 'h2.govuk-heading-m.govuk-\\!-margin-top-4',
  advancedSearchHeading: 'h2.govuk-heading-m',

  // Results headings and actions
  resultsHeading: 'h2.govuk-heading-m',
  addToListButton: 'button.govuk-button[type="button"]',
  selectedAccountsHint: 'p.govuk-hint',

  // Results table
  resultsTable: 'table.govuk-table',
  resultsTableBody: 'table.govuk-table tbody',
  resultsRows: 'table.govuk-table tbody > tr.govuk-table__row',
  resultAccountLink: 'td#defendantAccountNumber a.govuk-link',
  resultNameCell: 'td#defendantName',

  // Individuals search fields
  accountNumberInput: '#fcon_search_account_number',
  nationalInsuranceNumberInput: '#fcon_search_account_national_insurance_number',
  lastNameInput: '#fcon_search_account_individuals_last_name',
  lastNameExactMatchCheckbox: '#fcon_search_account_individuals_last_name_exact_match',
  firstNamesInput: '#fcon_search_account_individuals_first_names',
  firstNamesExactMatchCheckbox: '#fcon_search_account_individuals_first_names_exact_match',
  includeAliasesCheckbox: '#fcon_search_account_individuals_include_aliases',
  dateOfBirthInput: '#fcon_search_account_individuals_date_of_birth',
  addressLine1Input: '#fcon_search_account_individuals_address_line_1',
  postCodeInput: '#fcon_search_account_individuals_post_code',

  // Companies search fields
  companyNameInput: '#fcon_search_account_companies_company_name',
  companyNameExactMatchCheckbox: '#fcon_search_account_companies_company_name_exact_match',
  companyIncludeAliasesCheckbox: '#fcon_search_account_companies_include_aliases',
  companyAddressLine1Input: '#fcon_search_account_companies_address_line_1',
  companyPostCodeInput: '#fcon_search_account_companies_post_code',

  // Inline field errors
  accountNumberError: '#fcon_search_account_number-error-message',
  nationalInsuranceNumberError: '#fcon_search_account_national_insurance_number-error-message',
  lastNameError: '#fcon_search_account_individuals_last_name-error-message',
  firstNamesError: '#fcon_search_account_individuals_first_names-error-message',
  dateOfBirthError: '#fcon_search_account_individuals_date_of_birth-error-message',
  addressLine1Error: '#fcon_search_account_individuals_address_line_1-error-message',
  postCodeError: '#fcon_search_account_individuals_post_code-error-message',
  companyNameError: '#fcon_search_account_companies_company_name-error-message',
  companyAddressLine1Error: '#fcon_search_account_companies_address_line_1-error-message',
  companyPostCodeError: '#fcon_search_account_companies_post_code-error-message',

  // Search actions
  searchButton: 'button[buttonId="submitForm"]',
  clearSearchLink: 'a.govuk-link',
  errorSummary: '.govuk-error-summary',

  // Results row helpers
  resultRowWithAccount: (accountNumber: string) =>
    `tr.govuk-table__row:has(td#defendantAccountNumber a:contains("${accountNumber}"))`,
  resultAccountLinkByNumber: (accountNumber: string) =>
    `td#defendantAccountNumber a.govuk-link:contains("${accountNumber}")`,
};
