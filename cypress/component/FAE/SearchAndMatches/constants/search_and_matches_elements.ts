export const DOM_ELEMENTS = {
  app: 'app-fines-sa-search-account-form',
  heading: '.govuk-heading-l',
  tabs: 'opal-lib-govuk-tabs',
  tabsList: '.govuk-tabs__list',
  individualsTab: '[id="tab-individuals"]',
  companiesTab: '[id="tab-companies"]',
  minorCreditorsTab: '[id="tab-minor-creditors"]',
  majorCreditorsTab: '[id="tab-major-creditors"]',
  individualsPanel: '[id="individuals"]',
  individualsHeading: '[id="individuals"] .govuk-heading-l',
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

  // Individual tab fields
  lastNameLabel: '[for="fsa_search_account_individual_last_name"]',
  lastNameInput: '#fsa_search_account_individual_last_name',
  lastNameExactMatchCheckbox: '#fsa_search_account_individual_last_name_exact_match',
  lastNameError: '#fsa_search_account_individual_last_name-error-message',

  firstNamesLabel: '[for="fsa_search_account_individual_first_names"]',
  firstNamesInput: '#fsa_search_account_individual_first_names',
  firstNamesExactMatchCheckbox: '#fsa_search_account_individual_first_names_exact_match',
  firstNamesError: '#fsa_search_account_individual_first_names-error-message',

  includeAliasesCheckbox: '#fsa_search_account_individual_include_aliases',

  dobLabel: '[for="fsa_search_account_individual_date_of_birth"]',
  dobInput: '#fsa_search_account_individual_date_of_birth',
  dobError: '#fsa_search_account_individual_date_of_birth-date-error',

  niNumberLabel: '[for="fsa_search_account_individual_national_insurance_number"]',
  niNumberInput: '#fsa_search_account_individual_national_insurance_number',
  niNumberError: '#fsa_search_account_individual_national_insurance_number-error-message',

  addressLine1Label: '[for="fsa_search_account_individual_address_line_1"]',
  addressLine1Input: '#fsa_search_account_individual_address_line_1',
  addressLine1Error: '#fsa_search_account_individual_address_line_1-error-message',

  postcodeLabel: '[for="fsa_search_account_individual_post_code"]',
  postcodeInput: '#fsa_search_account_individual_post_code',
  postcodeError: '#fsa_search_account_individual_post_code-error-message',

  // Active accounts only checkbox
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  // Generic error message
  errorSummary: '.govuk-error-summary',
};
