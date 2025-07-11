export const DOM_ELEMENTS = {
  app: 'app-fines-sa-search-account-form',
  heading: '.govuk-heading-l',
  tabs: 'opal-lib-govuk-tabs',
  tabsList: '.govuk-tabs__list',
  individualsTab: '[id="tab-individuals"]',
  companiesTab: '[id="tab-companies"]',
  minorCreditorsTab: '[id="tab-minor-creditors"]',
  majorCreditorsTab: '[id="tab-major-creditors"]',
  companiesPanel: '[id="companies"]',
  companiesHeading: '[id="companies"] .govuk-heading-l',
  searchButton: '[buttonId="submitForm"]',

  // Filter by business unit section
  businessUnitSummaryList: '[summaryListId="accountDetails"]',
  businessUnitLink: '[summaryListRowId="languagePreferences"] a',
  businessUnitBadge: '.business-unit-badge',

  // Account number field
  accountNumberLabel: '[for="fsa_search_account_number"]',
  accountNumberInput: '#fsa_search_account_number',
  accountNumberError: '#fsa_search_account_number-error-message',

  // Reference or case number field
  referenceNumberLabel: '[for="fsa_search_account_reference_case_number"]',
  referenceNumberInput: '#fsa_search_account_reference_case_number',
  referenceNumberError: '#fsa_search_account_reference_case_number-error-message',

  // Company tab fields
  companyNameLabel: '[for="fsa_search_account_companies_company_name"]',
  companyNameInput: '#fsa_search_account_companies_company_name',
  companyNameExactMatchCheckbox: '#fsa_search_account_companies_company_name_exact_match',
  companyNameError: '#fsa_search_account_companies_company_name-error-message',

  includeAliasCheckbox: '#fsa_search_account_companies_include_aliases',

  addressLine1Label: '[for="fsa_search_account_companies_address_line_1"]',
  addressLine1Input: '#fsa_search_account_companies_address_line_1',
  addressLine1Error: '#fsa_search_account_companies_address_line_1-error-message',

  postcodeLabel: '[for="fsa_search_account_companies_post_code"]',
  postcodeInput: '#fsa_search_account_companies_post_code',
  postcodeError: '#fsa_search_account_companies_post_code-error-message',

  // Active accounts only checkbox
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  // Generic error message
  errorSummary: '.govuk-error-summary',
};
