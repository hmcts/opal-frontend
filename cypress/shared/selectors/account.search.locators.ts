export const AccountSearchLocators = {
  // ——— Root / layout ———
  // cover both historic & current components
  root: 'app-fines-sa-search-account-form, app-fines-sa-search, [data-testid="fines-sa-search"]',
  main: 'main[role="main"].govuk-main-wrapper',

  // ——— Header links ———
  signOutLink: 'nav[aria-label="Account navigation"] a.moj-header__navigation-link',
  orgLink: 'a.moj-header__link--organisation-name', // HMCTS
  serviceLink: 'a.moj-header__link--service-name', // Opal

  // ——— Summary list / change link ———
  businessUnitChangeLink: '#accountDetailsLanguagePreferencesActions .govuk-link',

  // ——— Top-level fields ———
  accountNumberInput: '#fsa_search_account_number',
  referenceOrCaseNumberInput: '#fsa_search_account_reference_case_number',

  // ——— Tabs ———
  tabsRoot: '#defendantTabs',
  individualsTab: '#tab-individuals .govuk-tabs__tab',
  companiesTab: '#tab-companies .govuk-tabs__tab',
  minorCreditorsTab: '#tab-minor-creditors .govuk-tabs__tab',
  majorCreditorsTab: '#tab-major-creditors .govuk-tabs__tab',

  // ——— Companies panel ———
  companyNameInput: '.account-search__company-name',

  // ——— Individuals panel ———
  individualsPanel: '#individuals .govuk-tabs__panel',

  // Name fields
  lastNameInput: '#fsa_search_account_individuals_last_name',
  lastNameExactMatchCheckbox: '#fsa_search_account_individuals_last_name_exact_match',
  firstNameInput: '#fsa_search_account_individuals_first_names',
  firstNamesExactMatchCheckbox: '#fsa_search_account_individuals_first_names_exact_match',
  includeAliasesCheckbox: '#fsa_search_account_individuals_include_aliases',

  // Date of birth (MOJ date picker)
  dobInput: '#fsa_search_account_individuals_date_of_birth',
  dobCalendarDialog: '#datepicker-fsa_search_account_individuals_date_of_birth',
  dobOpenButton: '.moj-js-datepicker-toggle',
  dobSelectButton: '.moj-datepicker__button.moj-js-datepicker-ok',
  dobCloseButton: '.moj-datepicker__button.moj-js-datepicker-cancel',

  // Other individual fields
  niNumberInput: '#fsa_search_account_individuals_national_insurance_number',
  addressLine1Input: '#fsa_search_account_individuals_address_line_1',
  postcodeInput: '#fsa_search_account_individuals_post_code',

  // ——— Global filters ———
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  // ——— Actions ———
  searchButton: '#submitForm',
};
