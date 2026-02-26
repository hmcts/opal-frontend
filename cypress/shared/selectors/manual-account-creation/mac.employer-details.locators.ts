/**
 * @file mac.employer-details.locators.ts
 * @description Selector map for the Manual Account Creation **Employer details** task.
 *
 * @remarks
 * - Centralises selectors for employer form fields, navigation CTAs, nested flows, and cancel link.
 * - Used by Cypress actions/flows to avoid inline selectors in specs.
 */
export const MacEmployerDetailsLocators = {
  app: 'app-fines-mac-employer-details-form',
  submitButton: 'button[type="submit"]',
  errorSummary: '.govuk-error-summary',
  pageHeader: 'h1.govuk-heading-l',
  pageTitle: 'h1.govuk-heading-l',
  companyNameLabel: 'label[for="fm_employer_details_employer_company_name"]',
  referenceLabel: 'label[for="fm_employer_details_employer_reference"]',
  emailAddressLabel: 'label[for="fm_employer_details_employer_email_address"]',
  telephoneNumberLabel: 'label[for="fm_employer_details_employer_telephone_number"]',
  addressLine1Label: 'label[for="fm_employer_details_employer_address_line_1"]',
  addressLine2Label: 'label[for="fm_employer_details_employer_address_line_2"]',
  addressLine3Label: 'label[for="fm_employer_details_employer_address_line_3"]',
  addressLine4Label: 'label[for="fm_employer_details_employer_address_line_4"]',
  addressLine5Label: 'label[for="fm_employer_details_employer_address_line_5"]',
  postCodeLabel: 'label[for="fm_employer_details_employer_post_code"]',
  referenceHint: 'div[id="fm_employer_details_employer_reference-hint"]',
  companyNameInput: 'input[id="fm_employer_details_employer_company_name"]',
  referenceInput: 'input[id="fm_employer_details_employer_reference"]',
  emailAddressInput: 'input[id="fm_employer_details_employer_email_address"]',
  telephoneNumberInput: 'input[id="fm_employer_details_employer_telephone_number"]',
  addressLine1Input: 'input[id="fm_employer_details_employer_address_line_1"]',
  addressLine2Input: 'input[id="fm_employer_details_employer_address_line_2"]',
  addressLine3Input: 'input[id="fm_employer_details_employer_address_line_3"]',
  addressLine4Input: 'input[id="fm_employer_details_employer_address_line_4"]',
  addressLine5Input: 'input[id="fm_employer_details_employer_address_line_5"]',
  postCodeInput: 'input[id="fm_employer_details_employer_post_code"]',
  employerNameInput: '#fm_employer_details_employer_company_name',
  employeeReferenceInput: '#fm_employer_details_employer_reference',
  employerEmailInput: '#fm_employer_details_employer_email_address',
  employerTelephoneInput: '#fm_employer_details_employer_telephone_number',
  postcodeInput: '#fm_employer_details_employer_post_code',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  nestedFlowButton: 'button.nested-flow',
  cancelLink: 'a.govuk-link.button-link',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;
