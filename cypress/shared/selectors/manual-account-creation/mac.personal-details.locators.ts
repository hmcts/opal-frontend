/**
 * @file mac.personal-details.locators.ts
 * @description Selector map for the Manual Account Creation **Personal details** task.
 *
 * @remarks
 * - Includes title dropdown, full name/address/vehicle inputs, and navigation CTAs.
 * - For Cypress actions/flows; keep selectors out of specs.
 */
export const MacPersonalDetailsLocators = {
  app: 'app-fines-mac-personal-details-form',
  pageHeader: 'h1.govuk-heading-l',
  pageTitle: 'h1.govuk-heading-l',
  titleSelect: 'select[id="fm_personal_details_title"]',
  titleInput: 'select[id="fm_personal_details_title"]',
  firstNamesInput: 'input[id="fm_personal_details_forenames"]',
  firstNameInput: 'input[id="fm_personal_details_forenames"]',
  lastNameInput: 'input[id="fm_personal_details_surname"]',
  dateOfBirthInput: 'input[id="fm_personal_details_dob"]',
  dobInput: 'input[id="fm_personal_details_dob"]',
  nationalInsuranceInput: 'input[id="fm_personal_details_national_insurance_number"]',
  niNumberInput: 'input[id="fm_personal_details_national_insurance_number"]',
  addressLine1Input: 'input[id="fm_personal_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_personal_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_personal_details_address_line_3"]',
  postcodeInput: 'input[id="fm_personal_details_post_code"]',
  vehicleMakeInput: 'input[id="fm_personal_details_vehicle_make"]',
  vehicle_makeInput: 'input[id="fm_personal_details_vehicle_make"]',
  vehicleRegistrationInput: 'input[id="fm_personal_details_vehicle_registration_mark"]',
  vehicle_registration_markInput: 'input[id="fm_personal_details_vehicle_registration_mark"]',
  titleLabel: 'label[for="fm_personal_details_title"]',
  firstNameLabel: 'label[for="fm_personal_details_forenames"]',
  lastNameLabel: 'label[for="fm_personal_details_surname"]',
  dobLabel: 'label[for="fm_personal_details_dob"]',
  addressLine1Label: 'label[for="fm_personal_details_address_line_1"]',
  addressLine2Label: 'label[for="fm_personal_details_address_line_2"]',
  addressLine3Label: 'label[for="fm_personal_details_address_line_3"]',
  postcodeLabel: 'label[for="fm_personal_details_post_code"]',
  vehicleMakeLabel: 'label[for="fm_personal_details_vehicle_make"]',
  vehicleRegistrationMarkLabel: 'label[for="fm_personal_details_vehicle_registration_mark"]',
  niNumberLabel: 'label[for="fm_personal_details_national_insurance_number"]',
  firstNameHint: 'div[id = "fm_personal_details_forenames-hint"]',
  DateHint: 'div.govuk-hint',
  legend: 'legend.govuk-fieldset__legend.govuk-fieldset__legend--m',
  aliasAdd: '#fm_personal_details_add_alias',
  aliasAddButton: 'button[id="addAlias"]',
  aliasRemoveButton: '.govuk-link--no-visited-state',
  aliasContainer: 'div[id="fm_personal_details_alias_container"]',
  submitButton: 'button[type="submit"]',
  returnToAccountDetailsButton: 'button:contains("Return to account details")',
  addContactDetailsButton: 'button:contains("Add contact details")',
  cancelLink: 'a.govuk-link.button-link',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;

export const getAliasFirstName = (index: number): string => `input[id="fm_personal_details_alias_forenames_${index}"]`;

export const getAliasLastName = (index: number): string => `input[id="fm_personal_details_alias_surname_${index}"]`;
