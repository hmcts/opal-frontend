export const CompanySearchLocators = {
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

  // Companies search fields
  accountNumberInput: '#fcon_search_account_number',
  companyNameInput: '#fcon_search_account_companies_company_name',
  companyNameExactMatchCheckbox: '#fcon_search_account_companies_company_name_exact_match',
  includeAliasesCheckbox: '#fcon_search_account_companies_include_aliases',
  addressLine1Input: '#fcon_search_account_companies_address_line_1',
  postCodeInput: '#fcon_search_account_companies_post_code',

  // Inline field errors
  accountNumberError: '#fcon_search_account_number-error-message',
  companyNameError: '#fcon_search_account_companies_company_name-error-message',
  addressLine1Error: '#fcon_search_account_companies_address_line_1-error-message',
  postCodeError: '#fcon_search_account_companies_post_code-error-message',

  // Search actions
  searchButton: 'button[buttonId="submitForm"]',
  clearSearchLink: 'a.govuk-link',
  errorSummary: '.govuk-error-summary',
};
