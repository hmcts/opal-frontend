/**
 * @file contact-details.locators.ts
 * @description Selector map for the Manual Account Creation **Contact details** task.
 *
 * @remarks
 * - Covers email/telephone inputs, navigation CTAs, cancel link, and inline errors.
 * - Centralized for reuse across Cypress actions/flows.
 */
export const ManualContactDetailsLocators = {
  pageHeader: 'h1.govuk-heading-l',
  primaryEmailInput: 'input[id="fm_contact_details_email_address_1"]',
  secondaryEmailInput: 'input[id="fm_contact_details_email_address_2"]',
  mobileTelephoneInput: 'input[id="fm_contact_details_telephone_number_mobile"]',
  homeTelephoneInput: 'input[id="fm_contact_details_telephone_number_home"]',
  workTelephoneInput: 'input[id="fm_contact_details_telephone_number_business"]',
  returnToAccountDetailsButton: 'button:contains("Return to account details")',
  addEmployerDetailsButton: 'button:contains("Add employer details")',
  addOffenceDetailsButton: 'button:contains("Add offence details")',
  cancelLink: 'a.govuk-link.button-link',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;
