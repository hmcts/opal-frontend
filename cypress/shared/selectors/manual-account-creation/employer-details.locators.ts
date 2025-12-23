/**
 * @file employer-details.locators.ts
 * @description Selector map for the Manual Account Creation **Employer details** task.
 *
 * @remarks
 * - Centralises selectors for employer form fields, navigation CTAs, nested flows, and cancel link.
 * - Used by Cypress actions/flows to avoid inline selectors in specs.
 */
export const ManualEmployerDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  employerNameInput: '#fm_employer_details_employer_company_name',
  employeeReferenceInput: '#fm_employer_details_employer_reference',
  employerEmailInput: '#fm_employer_details_employer_email_address',
  employerTelephoneInput: '#fm_employer_details_employer_telephone_number',
  addressLine1Input: '#fm_employer_details_employer_address_line_1',
  addressLine2Input: '#fm_employer_details_employer_address_line_2',
  addressLine3Input: '#fm_employer_details_employer_address_line_3',
  addressLine4Input: '#fm_employer_details_employer_address_line_4',
  addressLine5Input: '#fm_employer_details_employer_address_line_5',
  postcodeInput: '#fm_employer_details_employer_post_code',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  nestedFlowButton: 'button.nested-flow',
  cancelLink: 'a.govuk-link.button-link',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;
