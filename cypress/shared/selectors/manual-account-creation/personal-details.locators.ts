/**
 * @file personal-details.locators.ts
 * @description Selector map for the Manual Account Creation **Personal details** task.
 *
 * @remarks
 * - Includes title dropdown, full name/address/vehicle inputs, and navigation CTAs.
 * - For Cypress actions/flows; keep selectors out of specs.
 */
export const ManualPersonalDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  titleSelect: 'select[id="fm_personal_details_title"]',
  firstNamesInput: 'input[id="fm_personal_details_forenames"]',
  lastNameInput: 'input[id="fm_personal_details_surname"]',
  dateOfBirthInput: 'input[id="fm_personal_details_dob"]',
  nationalInsuranceInput: 'input[id="fm_personal_details_national_insurance_number"]',
  addressLine1Input: 'input[id="fm_personal_details_address_line_1"]',
  addressLine2Input: 'input[id="fm_personal_details_address_line_2"]',
  addressLine3Input: 'input[id="fm_personal_details_address_line_3"]',
  postcodeInput: 'input[id="fm_personal_details_post_code"]',
  vehicleMakeInput: 'input[id="fm_personal_details_vehicle_make"]',
  vehicleRegistrationInput: 'input[id="fm_personal_details_vehicle_registration_mark"]',
  returnToAccountDetailsButton: 'button:contains("Return to account details")',
  addContactDetailsButton: 'button:contains("Add contact details")',
  cancelLink: 'a.govuk-link.button-link',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;
