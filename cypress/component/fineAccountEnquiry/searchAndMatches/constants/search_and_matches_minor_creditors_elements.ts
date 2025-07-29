export const DOM_ELEMENTS = {
  app: 'app-fines-sa-search-account-form',
  heading: '.govuk-heading-l',
  tabs: 'opal-lib-govuk-tabs',
  tabsList: '.govuk-tabs__list',
  individualsTab: '[id="tab-individuals"]',
  companiesTab: '[id="tab-companies"]',
  minorCreditorsTab: '[id="tab-minor-creditors"]',
  majorCreditorsTab: '[id="tab-major-creditors"]',
  minorCreditorsPanel: '[id="minor-creditors"]',
  minorCreditorsHeading: '[id="minor-creditors"] .govuk-heading-l',
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

  // Minor creditors tab fields

  minorCreditorIndividualRadioButton: '#individual',
  minorCreditorCompanyRadioButton: '#company',

  //Individual
  lastNameLabel: '[for="fsa_search_account_minor_creditors_last_name"]',
  lastNameInput: '#fsa_search_account_minor_creditors_last_name',
  lastNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_last_name_exact_match',
  lastNameError: '#fsa_search_account_minor_creditors_last_name-error-message',

  firstNamesLabel: '[for="fsa_search_account_minor_creditors_first_names"]',
  firstNamesInput: '#fsa_search_account_minor_creditors_first_names',
  firstNamesExactMatchCheckbox: '#fsa_search_account_minor_creditors_first_names_exact_match',
  firstNamesError: '#fsa_search_account_minor_creditors_first_names-error-message',

  minorIndividualAddressLine1Label: '[for="fsa_search_account_minor_creditors_individual_address_line_1"]',
  minorIndividualAddressLine1Input: '#fsa_search_account_minor_creditors_individual_address_line_1',
  minorIndividualAddressLine1Error: '#fsa_search_account_minor_creditors_individual_address_line_1-error-message',

  minorIndividualPostcodeLabel: '[for="fsa_search_account_minor_creditors_individual_post_code"]',
  minorIndividualPostcodeInput: '#fsa_search_account_minor_creditors_individual_post_code',
  minorIndividualPostcodeError: '#fsa_search_account_minor_creditors_individual_post_code-error-message',

  //Company
  companyNameLabel: '[for="fsa_search_account_minor_creditors_company_name"]',
  companyNameInput: '#fsa_search_account_minor_creditors_company_name',
  companyNameExactMatchCheckbox: '#fsa_search_account_minor_creditors_company_name_exact_match',
  companyNameError: '#fsa_search_account_minor_creditors_company_name-error-message',

  addressLine1Label: '[for="fsa_search_account_minor_creditors_company_address_line_1"]',
  addressLine1Input: '#fsa_search_account_minor_creditors_company_address_line_1',
  addressLine1Error: '#fsa_search_account_minor_creditors_company_address_line_1-error-message',

  postcodeLabel: '[for="fsa_search_account_minor_creditors_company_post_code"]',
  postcodeInput: '#fsa_search_account_minor_creditors_company_post_code',
  postcodeError: '#fsa_search_account_minor_creditors_company_post_code-error-message',

  // Active accounts only checkbox
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  // Generic error message
  errorSummary: '.govuk-error-summary',
};
