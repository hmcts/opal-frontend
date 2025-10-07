export const DOM_ELEMENTS = {
  // Main component selectors
  mainComponent: 'app-fines-acc-debtor-add-amend',
  formComponent: 'app-fines-acc-debtor-add-amend-form',

  // Layout elements
  gridWrapper: '.govuk-grid-column-two-thirds',
  gridRow: '.govuk-grid-row',

  // Page structure
  pageTitle: 'h1.govuk-heading-l',
  pageSubtitle: '.govuk-body-l',

  // Form elements - Individual fields
  titleSelect: 'select[id="facc_debtor_add_amend_title"]',
  forenamesInput: 'input[id="facc_debtor_add_amend_forenames"]',
  surnameInput: 'input[id="facc_debtor_add_amend_surname"]',
  dobInput: 'input[id="facc_debtor_add_amend_dob"]',
  niNumberInput: 'input[id="facc_debtor_add_amend_national_insurance_number"]',

  // Address fields
  addressLine1Input: 'input[id="facc_debtor_add_amend_address_line_1"]',
  addressLine2Input: 'input[id="facc_debtor_add_amend_address_line_2"]',
  addressLine3Input: 'input[id="facc_debtor_add_amend_address_line_3"]',
  postcodeInput: 'input[id="facc_debtor_add_amend_post_code"]',

  // Contact details
  email1Input: 'input[id="facc_debtor_add_amend_contact_email_address_1"]',
  email2Input: 'input[id="facc_debtor_add_amend_contact_email_address_2"]',
  mobilePhoneInput: 'input[id="facc_debtor_add_amend_contact_telephone_number_mobile"]',
  homePhoneInput: 'input[id="facc_debtor_add_amend_contact_telephone_number_home"]',
  businessPhoneInput: 'input[id="facc_debtor_add_amend_contact_telephone_number_business"]',

  // Vehicle details
  vehicleMakeInput: 'input[id="facc_debtor_add_amend_vehicle_make"]',
  vehicleRegistrationInput: 'input[id="facc_debtor_add_amend_vehicle_registration_mark"]',

  // Language preferences
  documentLanguageSelect: 'select[id="facc_debtor_add_amend_language_preferences_document_language"]',
  hearingLanguageSelect: 'select[id="facc_debtor_add_amend_language_preferences_hearing_language"]',

  // Employer details
  employerCompanyInput: 'input[id="facc_debtor_add_amend_employer_details_employer_company_name"]',
  employerReferenceInput: 'input[id="facc_debtor_add_amend_employer_details_employer_reference"]',
  employerEmailInput: 'input[id="facc_debtor_add_amend_employer_details_employer_email_address"]',
  employerPhoneInput: 'input[id="facc_debtor_add_amend_employer_details_employer_telephone_number"]',
  employerAddressLine1Input: 'input[id="facc_debtor_add_amend_employer_details_employer_address_line_1"]',
  employerAddressLine2Input: 'input[id="facc_debtor_add_amend_employer_details_employer_address_line_2"]',
  employerAddressLine3Input: 'input[id="facc_debtor_add_amend_employer_details_employer_address_line_3"]',
  employerAddressLine4Input: 'input[id="facc_debtor_add_amend_employer_details_employer_address_line_4"]',
  employerAddressLine5Input: 'input[id="facc_debtor_add_amend_employer_details_employer_address_line_5"]',
  employerPostcodeInput: 'input[id="facc_debtor_add_amend_employer_details_employer_post_code"]',

  // Alias functionality
  aliasCheckbox: 'input[id="facc_debtor_add_amend_add_alias"]',
  aliasSection: '[opal-lib-govuk-checkboxes-conditional]',
  aliasForenamesInput: 'input[id="facc_debtor_add_amend_alias_forenames_0"]',
  aliasSurnameInput: 'input[id="facc_debtor_add_amend_alias_surname_0"]',
  aliasForenamesInput1: 'input[id="facc_debtor_add_amend_alias_forenames_1"]',
  aliasSurnameInput1: 'input[id="facc_debtor_add_amend_alias_surname_1"]',
  aliasForenamesInput2: 'input[id="facc_debtor_add_amend_alias_forenames_2"]',
  aliasSurnameInput2: 'input[id="facc_debtor_add_amend_alias_surname_2"]',
  aliasForenamesInput3: 'input[id="facc_debtor_add_amend_alias_forenames_3"]',
  aliasSurnameInput3: 'input[id="facc_debtor_add_amend_alias_surname_3"]',
  aliasSurnameInput4: 'input[id="facc_debtor_add_amend_alias_surname_4"]',
  aliasForenamesInput4: 'input[id="facc_debtor_add_amend_alias_forenames_4"]',
  addAliasButton: '#addAlias',
  removeAliasButton: '.remove-alias-button',

  // Form labels
  titleLabel: 'label[for="facc_debtor_add_amend_title"]',
  forenamesLabel: 'label[for="facc_debtor_add_amend_forenames"]',
  surnameLabel: 'label[for="facc_debtor_add_amend_surname"]',
  dobLabel: 'label[for="facc_debtor_add_amend_dob"]',
  niNumberLabel: 'label[for="facc_debtor_add_amend_national_insurance_number"]',
  addressLine1Label: 'label[for="facc_debtor_add_amend_address_line_1"]',
  addressLine2Label: 'label[for="facc_debtor_add_amend_address_line_2"]',
  addressLine3Label: 'label[for="facc_debtor_add_amend_address_line_3"]',
  postcodeLabel: 'label[for="facc_debtor_add_amend_post_code"]',
  email1Label: 'label[for="facc_debtor_add_amend_contact_email_address_1"]',
  email2Label: 'label[for="facc_debtor_add_amend_contact_email_address_2"]',
  mobilePhoneLabel: 'label[for="facc_debtor_add_amend_contact_telephone_number_mobile"]',
  homePhoneLabel: 'label[for="facc_debtor_add_amend_contact_telephone_number_home"]',
  businessPhoneLabel: 'label[for="facc_debtor_add_amend_contact_telephone_number_business"]',
  vehicleMakeLabel: 'label[for="facc_debtor_add_amend_vehicle_make"]',
  vehicleRegistrationLabel: 'label[for="facc_debtor_add_amend_vehicle_registration_mark"]',
  employerCompanyLabel: 'label[for="facc_debtor_add_amend_employer_details_employer_company_name"]',
  employerReferenceLabel: 'label[for="facc_debtor_add_amend_employer_details_employer_reference"]',
  employerEmailLabel: 'label[for="facc_debtor_add_amend_employer_details_employer_email_address"]',
  employerPhoneLabel: 'label[for="facc_debtor_add_amend_employer_details_employer_telephone_number"]',
  employerAddressLine1Label: 'label[for="facc_debtor_add_amend_employer_details_employer_address_line_1"]',
  employerAddressLine2Label: 'label[for="facc_debtor_add_amend_employer_details_employer_address_line_2"]',
  employerAddressLine3Label: 'label[for="facc_debtor_add_amend_employer_details_employer_address_line_3"]',
  employerAddressLine4Label: 'label[for="facc_debtor_add_amend_employer_details_employer_address_line_4"]',
  employerAddressLine5Label: 'label[for="facc_debtor_add_amend_employer_details_employer_address_line_5"]',
  employerPostcodeLabel: 'label[for="facc_debtor_add_amend_employer_details_employer_post_code"]',
  aliasForenamesLabel: 'label[for="facc_debtor_add_amend_alias_forenames_0"]',
  aliasSurnameLabel: 'label[for="facc_debtor_add_amend_alias_surname_0"]',

  // Form hints
  forenamesHint: 'div[id="facc_debtor_add_amend_forenames-hint"]',
  dobHint: 'div[id="facc_debtor_add_amend_dob-hint"]',
  postcodeHint: 'div[id="facc_debtor_add_amend_post_code-hint"]',
  employerReferenceHint: 'div[id="facc_debtor_add_amend_employer_details_employer_reference-hint"]',

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
};

// Helper functions for dynamic element selection
export const getAliasForenamesInput = (index: number) => `input[id="facc_debtor_add_amend_alias_forenames_${index}"]`;

export const getAliasSurnameInput = (index: number) => `input[id="facc_debtor_add_amend_alias_surname_${index}"]`;

export const getAliasContainer = (index: number) => `.alias-container[data-index="${index}"]`;

export const getFieldErrorFor = (fieldId: string) => `#${fieldId}-error`;
