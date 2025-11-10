/**
 * Locators for account enquiries view details functionality.
 * Used for testing defendant details forms including route guards and cancel changes.
 */
export const DOM_ELEMENTS = {
  // Main component selectors
  mainComponent: 'app-fines-acc-party-add-amend-convert',
  formComponent: 'app-fines-acc-party-add-amend-convert-form',

  // Layout elements
  gridWrapper: '.govuk-grid-column-two-thirds',
  gridRow: '.govuk-grid-row',

  // Page structure
  pageTitle: 'h1.govuk-heading-l',
  pageSubtitle: '.govuk-body-l',

  // Form elements - Organisation/Company fields
  organisationNameInput: 'input[id="facc_party_add_amend_convert_organisation_name"]',
  organisationNameLabel: 'label[for="facc_party_add_amend_convert_organisation_name"]',

  // Organisation aliases
  organisationAliasCheckbox: 'input[id="facc_party_add_amend_convert_add_alias"]',
  organisationAliasSection: '[opal-lib-govuk-checkboxes-conditional]',
  organisationAliasInput0: 'input[id="facc_party_add_amend_convert_alias_organisation_name_0"]',
  organisationAliasInput1: 'input[id="facc_party_add_amend_convert_alias_organisation_name_1"]',
  organisationAliasInput2: 'input[id="facc_party_add_amend_convert_alias_organisation_name_2"]',
  organisationAliasInput3: 'input[id="facc_party_add_amend_convert_alias_organisation_name_3"]',
  organisationAliasInput4: 'input[id="facc_party_add_amend_convert_alias_organisation_name_4"]',
  organisationAliasLabel0: 'label[for="facc_party_add_amend_convert_alias_organisation_name_0"]',
  organisationAliasLabel1: 'label[for="facc_party_add_amend_convert_alias_organisation_name_1"]',
  organisationAliasLabel2: 'label[for="facc_party_add_amend_convert_alias_organisation_name_2"]',
  organisationAliasLabel3: 'label[for="facc_party_add_amend_convert_alias_organisation_name_3"]',
  organisationAliasLabel4: 'label[for="facc_party_add_amend_convert_alias_organisation_name_4"]',
  addOrganisationAliasButton: '#addAlias',
  removeOrganisationAliasButton: '.govuk-\\!-margin-bottom-3 > .govuk-link',

  // Form elements - Individual fields
  titleSelect: 'select[id="facc_party_add_amend_convert_title"]',
  forenamesInput: 'input[id="facc_party_add_amend_convert_forenames"]',
  surnameInput: 'input[id="facc_party_add_amend_convert_surname"]',
  dobInput: 'input[id="facc_party_add_amend_convert_dob"]',
  niNumberInput: 'input[id="facc_party_add_amend_convert_national_insurance_number"]',

  // Address fields
  addressLine1Input: 'input[id="facc_party_add_amend_convert_address_line_1"]',
  addressLine2Input: 'input[id="facc_party_add_amend_convert_address_line_2"]',
  addressLine3Input: 'input[id="facc_party_add_amend_convert_address_line_3"]',
  postcodeInput: 'input[id="facc_party_add_amend_convert_post_code"]',

  // Contact details
  email1Input: 'input[id="facc_party_add_amend_convert_contact_email_address_1"]',
  email2Input: 'input[id="facc_party_add_amend_convert_contact_email_address_2"]',
  mobilePhoneInput: 'input[id="facc_party_add_amend_convert_contact_telephone_number_mobile"]',
  homePhoneInput: 'input[id="facc_party_add_amend_convert_contact_telephone_number_home"]',
  businessPhoneInput: 'input[id="facc_party_add_amend_convert_contact_telephone_number_business"]',

  // Vehicle details
  vehicleMakeInput: 'input[id="facc_party_add_amend_convert_vehicle_make"]',
  vehicleRegistrationInput: 'input[id="facc_party_add_amend_convert_vehicle_registration_mark"]',

  // Language
  documentLanguageSelect: 'input[id="facc_party_add_amend_convert_language_preferences_document_language"]',
  hearingLanguageSelect: 'input[id="facc_party_add_amend_convert_language_preferences_hearing_language"]',

  // Employer details
  employerCompanyInput: 'input[id="facc_party_add_amend_convert_employer_company_name"]',
  employerReferenceInput: 'input[id="facc_party_add_amend_convert_employer_reference"]',
  employerEmailInput: 'input[id="facc_party_add_amend_convert_employer_email_address"]',
  employerPhoneInput: 'input[id="facc_party_add_amend_convert_employer_telephone_number"]',
  employerAddressLine1Input: 'input[id="facc_party_add_amend_convert_employer_address_line_1"]',
  employerAddressLine2Input: 'input[id="facc_party_add_amend_convert_employer_address_line_2"]',
  employerAddressLine3Input: 'input[id="facc_party_add_amend_convert_employer_address_line_3"]',
  employerAddressLine4Input: 'input[id="facc_party_add_amend_convert_employer_address_line_4"]',
  employerAddressLine5Input: 'input[id="facc_party_add_amend_convert_employer_address_line_5"]',
  employerPostcodeInput: 'input[id="facc_party_add_amend_convert_employer_post_code"]',

  // Alias functionality
  aliasCheckbox: 'input[id="facc_party_add_amend_convert_add_alias"]',
  aliasSection: '[opal-lib-govuk-checkboxes-conditional]',
  aliasForenamesInput: 'input[id="facc_party_add_amend_convert_alias_forenames_0"]',
  aliasSurnameInput: 'input[id="facc_party_add_amend_convert_alias_surname_0"]',
  aliasForenamesInput1: 'input[id="facc_party_add_amend_convert_alias_forenames_1"]',
  aliasSurnameInput1: 'input[id="facc_party_add_amend_convert_alias_surname_1"]',
  aliasForenamesInput2: 'input[id="facc_party_add_amend_convert_alias_forenames_2"]',
  aliasSurnameInput2: 'input[id="facc_party_add_amend_convert_alias_surname_2"]',
  aliasForenamesInput3: 'input[id="facc_party_add_amend_convert_alias_forenames_3"]',
  aliasSurnameInput3: 'input[id="facc_party_add_amend_convert_alias_surname_3"]',
  aliasSurnameInput4: 'input[id="facc_party_add_amend_convert_alias_surname_4"]',
  aliasForenamesInput4: 'input[id="facc_party_add_amend_convert_alias_forenames_4"]',
  addAliasButton: '#addAlias',
  removeAliasButton: '.remove-alias-button',

  // Form labels
  titleLabel: 'label[for="facc_party_add_amend_convert_title"]',
  forenamesLabel: 'label[for="facc_party_add_amend_convert_forenames"]',
  surnameLabel: 'label[for="facc_party_add_amend_convert_surname"]',
  dobLabel: 'label[for="facc_party_add_amend_convert_dob"]',
  niNumberLabel: 'label[for="facc_party_add_amend_convert_national_insurance_number"]',
  addressLine1Label: 'label[for="facc_party_add_amend_convert_address_line_1"]',
  addressLine2Label: 'label[for="facc_party_add_amend_convert_address_line_2"]',
  addressLine3Label: 'label[for="facc_party_add_amend_convert_address_line_3"]',
  postcodeLabel: 'label[for="facc_party_add_amend_convert_post_code"]',
  email1Label: 'label[for="facc_party_add_amend_convert_contact_email_address_1"]',
  email2Label: 'label[for="facc_party_add_amend_convert_contact_email_address_2"]',
  mobilePhoneLabel: 'label[for="facc_party_add_amend_convert_contact_telephone_number_mobile"]',
  homePhoneLabel: 'label[for="facc_party_add_amend_convert_contact_telephone_number_home"]',
  businessPhoneLabel: 'label[for="facc_party_add_amend_convert_contact_telephone_number_business"]',
  vehicleMakeLabel: 'label[for="facc_party_add_amend_convert_vehicle_make"]',
  vehicleRegistrationLabel: 'label[for="facc_party_add_amend_convert_vehicle_registration_mark"]',
  employerCompanyLabel: 'label[for="facc_party_add_amend_convert_employer_company_name"]',
  employerReferenceLabel: 'label[for="facc_party_add_amend_convert_employer_reference"]',
  employerEmailLabel: 'label[for="facc_party_add_amend_convert_employer_email_address"]',
  employerPhoneLabel: 'label[for="facc_party_add_amend_convert_employer_telephone_number"]',
  employerAddressLine1Label: 'label[for="facc_party_add_amend_convert_employer_address_line_1"]',
  employerAddressLine2Label: 'label[for="facc_party_add_amend_convert_employer_address_line_2"]',
  employerAddressLine3Label: 'label[for="facc_party_add_amend_convert_employer_address_line_3"]',
  employerAddressLine4Label: 'label[for="facc_party_add_amend_convert_employer_address_line_4"]',
  employerAddressLine5Label: 'label[for="facc_party_add_amend_convert_employer_address_line_5"]',
  employerPostcodeLabel: 'label[for="facc_party_add_amend_convert_employer_post_code"]',
  aliasForenamesLabel: 'label[for="facc_party_add_amend_convert_alias_forenames_0"]',
  aliasSurnameLabel: 'label[for="facc_party_add_amend_convert_alias_surname_0"]',

  // Form hints
  forenamesHint: 'div[id="facc_party_add_amend_convert_forenames-hint"]',
  dobHint: 'div[id="facc_party_add_amend_convert_dob-hint"]',
  postcodeHint: 'div[id="facc_party_add_amend_convert_post_code-hint"]',
  employerReferenceHint: 'div[id="facc_party_add_amend_convert_employer_details_employer_reference-hint"]',

  // Form actions
  submitButton: 'button[type="submit"]',
  cancelButton: '.govuk-button--secondary',
  saveButton: '.save-button',

  // Error elements
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
  fieldError: '.govuk-error-message',

  // Loading and state elements
  loadingSpinner: '.loading-spinner',
  formContainer: '.form-container',

  // Navigation elements
  breadcrumbs: '.govuk-breadcrumbs',
  backLink: '.govuk-back-link',

  // Fieldsets and legends
  personalDetailsFieldset: 'fieldset[id="personal-details"]',
  addressFieldset: 'fieldset:has(legend:contains("Address"))',
  contactFieldset: 'fieldset:has(legend:contains("Contact details"))',
  vehicleFieldset: 'fieldset:has(legend:contains("Vehicle details"))',
  employerFieldset: 'fieldset:has(legend:contains("Employer details"))',
  employerAddressFieldset: 'fieldset:has(legend:contains("Employer address"))',
  languagePreferencesFieldset: 'fieldset:has(legend:contains("Language preferences"))',
  documentLanguageFieldset: 'fieldset:has(legend:contains("Documents"))',
  hearingLanguageFieldset: 'fieldset:has(legend:contains("Court hearings"))',

  personalDetailsLegend: 'legend[id="personal-details-legend"]',
  addressLegend: 'legend:contains("Address")',
  contactLegend: 'legend:contains("Contact details")',
  vehicleLegend: 'legend:contains("Vehicle details")',
  employerLegend: 'legend:contains("Employer details")',
  employerAddressLegend: 'legend:contains("Employer address")',
  languagePreferencesLegend: 'legend:contains("Language preferences")',
  documentLanguageLegend: 'legend:contains("Documents")',
  hearingLanguageLegend: 'legend:contains("Court hearings")',

  // Age display elements
  ageDisplay: '.moj-ticket-panel',
  ageValue: '.moj-ticket-panel strong',
  ageGroup: '.moj-ticket-panel p',

  // Language preferences - Radio buttons (not input fields)
  documentLanguageRadioEN: 'input[id="ENDocumentRadioOption"]',
  documentLanguageRadioCY: 'input[id="CYDocumentRadioOption"]',
  hearingLanguageRadioEN: 'input[id="ENCourtHearingRadioOption"]',
  hearingLanguageRadioCY: 'input[id="CYCourtHearingRadioOption"]',

  // Language preference labels
  documentLanguageRadioLabelEN: 'label[for="ENDocumentRadioOption"]',
  documentLanguageRadioLabelCY: 'label[for="CYDocumentRadioOption"]',
  hearingLanguageRadioLabelEN: 'label[for="ENCourtHearingRadioOption"]',
  hearingLanguageRadioLabelCY: 'label[for="CYCourtHearingRadioOption"]',
};

// Helper functions for dynamic element selection
export const getAliasForenamesInput = (index: number) =>
  `input[id="facc_party_add_amend_convert_alias_forenames_${index}"]`;

export const getAliasSurnameInput = (index: number) =>
  `input[id="facc_party_add_amend_convert_alias_surname_${index}"]`;

export const getOrganisationAliasInput = (index: number) =>
  `input[id="facc_party_add_amend_convert_alias_organisation_name_${index}"]`;

export const getOrganisationAliasLabel = (index: number) =>
  `label[for="facc_party_add_amend_convert_alias_organisation_name_${index}"]`;

export const getAliasContainer = (index: number) => `.alias-container[data-index="${index}"]`;

export const getFieldErrorFor = (fieldId: string) => `#${fieldId}-error`;

// Error messages - Individual/Paying Defendant
export const ERROR_MESSAGES = {
  // Required field errors - Individual
  REQUIRED_TITLE: 'Select a title',
  REQUIRED_FORENAMES: "Enter defendant's first name(s)",
  REQUIRED_SURNAME: "Enter defendant's last name",
  REQUIRED_ADDRESS_LINE_1: 'Enter address line 1, typically the building and street',

  // Required field errors - Employer (conditional)
  REQUIRED_EMPLOYER_NAME: 'Enter employer name',
  REQUIRED_EMPLOYER_REFERENCE_OR_NI: 'Enter employee reference or National Insurance number',
  REQUIRED_EMPLOYER_ADDRESS_LINE_1: 'Enter address line 1, typically the building and street',

  // Required field errors - Alias
  REQUIRED_ALIAS_FORENAMES: (n: number) => `Enter alias ${n} first name(s)`,
  REQUIRED_ALIAS_SURNAME: (n: number) => `Enter alias ${n} last name`,

  // Format validation errors
  FORMAT_DOB_INVALID: 'Enter date of birth in the format DD/MM/YYYY',
  FORMAT_DOB_FUTURE: 'Enter a valid date of birth in the past',
  FORMAT_NI_NUMBER: 'Enter a National Insurance number in the format AANNNNNNA',

  // Email format errors
  FORMAT_EMAIL_PRIMARY: 'Enter primary email address in the correct format, like name@example.com',
  FORMAT_EMAIL_SECONDARY: 'Enter secondary email address in the correct format, like name@example.com',
  FORMAT_EMAIL_EMPLOYER: 'Enter employer email address in the correct format, like name@example.com',

  // Telephone format errors
  FORMAT_PHONE_HOME: 'Enter a valid home telephone number, like 01632 960 001',
  FORMAT_PHONE_WORK: 'Enter a valid work telephone number, like 01632 960 001 or 07700 900 982',
  FORMAT_PHONE_MOBILE: 'Enter a valid mobile telephone number, like 07700 900 982',
  FORMAT_PHONE_EMPLOYER:
    'Enter a valid employer telephone number in the correct format, like 07700 900 982 or 01263 766122',

  // Max length errors - Individual
  MAX_LENGTH_FORENAMES: "Defendant's first name(s) must be 20 characters or fewer",
  MAX_LENGTH_SURNAME: "Defendant's last name must be 30 characters or fewer",
  MAX_LENGTH_ALIAS_FORENAMES: 'Alias 1 first name(s) must be 20 characters or fewer',
  MAX_LENGTH_ALIAS_SURNAME: 'Alias 1 last name must be 30 characters or fewer',
  MAX_LENGTH_NI_NUMBER: 'Enter a National Insurance number in the format AANNNNNNA',
  MAX_LENGTH_ADDRESS_LINE_1: 'Address line 1 must be 30 characters or fewer',
  MAX_LENGTH_ADDRESS_LINE_2: 'Address line 2 must be 30 characters or fewer',
  MAX_LENGTH_ADDRESS_LINE_3: 'Address line 3 must be 16 characters or fewer',
  MAX_LENGTH_POSTCODE: 'Postcode must be 8 characters or fewer',
  MAX_LENGTH_EMAIL_PRIMARY: 'Primary email address must be 76 characters or fewer',
  MAX_LENGTH_EMAIL_SECONDARY: 'Secondary email address must be 76 characters or fewer',
  MAX_LENGTH_VEHICLE_MAKE: 'Make and model must be 30 characters or fewer',
  MAX_LENGTH_VEHICLE_REGISTRATION: 'Vehicle registration must be 11 characters or fewer',
  MAX_LENGTH_EMPLOYER_NAME: 'Employer name must be 50 characters or fewer',
  MAX_LENGTH_EMPLOYER_REFERENCE: 'Employee reference must be 20 characters or fewer',
  MAX_LENGTH_EMPLOYER_EMAIL: 'Employer email address must be 76 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1: 'Address line 1 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2: 'Address line 2 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3: 'Address line 3 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4: 'Address line 4 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5: 'Address line 5 must be 30 characters or fewer',
  MAX_LENGTH_EMPLOYER_POSTCODE: 'Postcode must be 8 characters or fewer',

  // Data type errors - Alphabetical
  DATA_TYPE_FORENAMES: "Defendant's first name(s) must only contain letters",
  DATA_TYPE_SURNAME: "Defendant's last name must only contain letters",
  DATA_TYPE_ALIAS_FORENAMES: 'Alias 1 first name(s) must only contain letters',
  DATA_TYPE_ALIAS_SURNAME: 'Alias 1 last name must only contain letters',

  // Data type errors - Alphanumeric
  DATA_TYPE_ADDRESS_LINE_1: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_ADDRESS_LINE_2: 'Address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_ADDRESS_LINE_3: 'Address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_POSTCODE: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_VEHICLE_MAKE:
    'Vehicle make and model must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_VEHICLE_REGISTRATION:
    'Vehicle registration must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_NAME: 'Employer name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_REFERENCE:
    'Employer reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_1:
    'Employer address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_2:
    'Employer address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_3:
    'Employer address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_4:
    'Employer address line 4 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_ADDRESS_LINE_5:
    'Employer address line 5 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
  DATA_TYPE_EMPLOYER_POSTCODE:
    'Employer postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',

  // Company errors
  REQUIRED_COMPANY_NAME: 'Enter company name',
  REQUIRED_COMPANY_ALIAS: (n: number) => `Enter alias ${n} company name`,
  MAX_LENGTH_COMPANY_NAME: 'Company name must be 50 characters or fewer',
  MAX_LENGTH_COMPANY_ALIAS: 'Alias 1 company name must be 20 characters or fewer',
  MAX_LENGTH_COMPANY_ALIAS_2: 'Alias 2 company name must be 20 characters or fewer',
  DATA_TYPE_COMPANY_NAME:
    'Company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
  DATA_TYPE_COMPANY_ALIAS_1:
    'Alias 1 company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
  DATA_TYPE_COMPANY_ALIAS_2:
    'Alias 2 company name must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)',
};

// Pre-defined error message arrays for common test scenarios
export const INDIVIDUAL_REQUIRED_MESSAGES = [
  ERROR_MESSAGES.REQUIRED_TITLE,
  ERROR_MESSAGES.REQUIRED_FORENAMES,
  ERROR_MESSAGES.REQUIRED_SURNAME,
  ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const EMPLOYER_REQUIRED_MESSAGES = [
  ERROR_MESSAGES.REQUIRED_EMPLOYER_REFERENCE_OR_NI,
  ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const INDIVIDUAL_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_NAME,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_EMAIL,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_POSTCODE,
];

export const INDIVIDUAL_ALPHABETICAL_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_FORENAMES,
  ERROR_MESSAGES.DATA_TYPE_SURNAME,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_FORENAMES,
  ERROR_MESSAGES.DATA_TYPE_ALIAS_SURNAME,
];

export const INDIVIDUAL_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_MAKE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_NAME,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.DATA_TYPE_EMPLOYER_POSTCODE,
];

export const INDIVIDUAL_ALL_DATA_TYPE_ERRORS = [...INDIVIDUAL_ALPHABETICAL_ERRORS, ...INDIVIDUAL_ALPHANUMERIC_ERRORS];

// Non-paying defendant error messages (subset of individual)
export const NON_PAYING_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
];

export const NON_PAYING_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
];

export const NON_PAYING_ALL_DATA_TYPE_ERRORS = [...INDIVIDUAL_ALPHABETICAL_ERRORS, ...NON_PAYING_ALPHANUMERIC_ERRORS];

// Company error messages
export const COMPANY_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_NAME,
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_ALIAS,
  ERROR_MESSAGES.MAX_LENGTH_COMPANY_ALIAS_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
];

export const COMPANY_ALPHABETICAL_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_COMPANY_NAME,
  ERROR_MESSAGES.DATA_TYPE_COMPANY_ALIAS_1,
  ERROR_MESSAGES.DATA_TYPE_COMPANY_ALIAS_2,
];

export const COMPANY_ALPHANUMERIC_ERRORS = [
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_1,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_2,
  ERROR_MESSAGES.DATA_TYPE_ADDRESS_LINE_3,
  ERROR_MESSAGES.DATA_TYPE_POSTCODE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_MAKE,
  ERROR_MESSAGES.DATA_TYPE_VEHICLE_REGISTRATION,
];

export const COMPANY_ALL_DATA_TYPE_ERRORS = [...COMPANY_ALPHABETICAL_ERRORS, ...COMPANY_ALPHANUMERIC_ERRORS];

// Parent/Guardian error messages (legacy compatibility)
export const PARENT_GUARDIAN_REQUIRED_MESSAGES = [
  ERROR_MESSAGES.REQUIRED_FORENAMES,
  ERROR_MESSAGES.REQUIRED_SURNAME,
  ERROR_MESSAGES.REQUIRED_ADDRESS_LINE_1,
];

export const PARENT_GUARDIAN_MAX_LENGTH_ERRORS = [
  ERROR_MESSAGES.MAX_LENGTH_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_FORENAMES,
  ERROR_MESSAGES.MAX_LENGTH_ALIAS_SURNAME,
  ERROR_MESSAGES.MAX_LENGTH_NI_NUMBER,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_POSTCODE,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_PRIMARY,
  ERROR_MESSAGES.MAX_LENGTH_EMAIL_SECONDARY,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_MAKE,
  ERROR_MESSAGES.MAX_LENGTH_VEHICLE_REGISTRATION,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_NAME,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_REFERENCE,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_EMAIL,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_1,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_2,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_3,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_4,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_ADDRESS_LINE_5,
  ERROR_MESSAGES.MAX_LENGTH_EMPLOYER_POSTCODE,
];

export const PARENT_GUARDIAN_ALL_DATA_TYPE_ERRORS = INDIVIDUAL_ALL_DATA_TYPE_ERRORS;

// Legacy exports for backward compatibility
export const coreRequiredMessages = PARENT_GUARDIAN_REQUIRED_MESSAGES;
export const expectedErrors = PARENT_GUARDIAN_MAX_LENGTH_ERRORS;
export const alphabeticalFieldErrors = INDIVIDUAL_ALPHABETICAL_ERRORS;
export const alphanumericFieldErrors = INDIVIDUAL_ALPHANUMERIC_ERRORS;
export const allExpectedErrors = PARENT_GUARDIAN_ALL_DATA_TYPE_ERRORS;

export const cancelLink = 'a';
export const cancelLinkText = 'Cancel';
export const defendantLinkText = 'Defendant';
export const changeLinkText = 'Change';
export const pageHeading = 'h1';

export const getInputFieldByLabel = (fieldName: string) => {
  return cy.contains('opal-lib-govuk-text-input', fieldName, { matchCase: false }).find('input');
};
