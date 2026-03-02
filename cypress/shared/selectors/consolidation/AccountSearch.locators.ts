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

  // Inline field errors
  accountNumberError: '#fcon_search_account_number-error-message',
  nationalInsuranceNumberError: '#fcon_search_account_national_insurance_number-error-message',
  lastNameError: '#fcon_search_account_individuals_last_name-error-message',
  firstNamesError: '#fcon_search_account_individuals_first_names-error-message',
  dateOfBirthError: '#fcon_search_account_individuals_date_of_birth-error-message',
  addressLine1Error: '#fcon_search_account_individuals_address_line_1-error-message',
  postCodeError: '#fcon_search_account_individuals_post_code-error-message',

  // Search actions
  searchButton: 'button[buttonId="submitForm"]',
  clearSearchLink: 'a.govuk-link',
  errorSummary: '.govuk-error-summary',
};
