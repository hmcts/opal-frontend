/**
 * @file mac.contact-details.locators.ts
 * @description Selector map for the Manual Account Creation **Contact details** task.
 *
 * @remarks
 * - Covers email/telephone inputs, navigation CTAs, cancel link, and inline errors.
 * - Centralized for reuse across Cypress actions/flows.
 */
export const MacContactDetailsLocators = {
  componentRoot: 'app-fines-mac-contact-details-form',
  pageHeader: 'h1.govuk-heading-l',
  primaryEmailLabel: 'label[for="fm_contact_details_email_address_1"]',
  secondaryEmailLabel: 'label[for="fm_contact_details_email_address_2"]',
  mobileTelephoneLabel: 'label[for="fm_contact_details_telephone_number_mobile"]',
  homeTelephoneLabel: 'label[for="fm_contact_details_telephone_number_home"]',
  workTelephoneLabel: 'label[for="fm_contact_details_telephone_number_business"]',
  primaryEmailInput: 'input[id="fm_contact_details_email_address_1"]',
  secondaryEmailInput: 'input[id="fm_contact_details_email_address_2"]',
  mobileTelephoneInput: 'input[id="fm_contact_details_telephone_number_mobile"]',
  homeTelephoneInput: 'input[id="fm_contact_details_telephone_number_home"]',
  workTelephoneInput: 'input[id="fm_contact_details_telephone_number_business"]',
  returnToAccountDetailsButton: 'button:contains("Return to account details")',
  addEmployerDetailsButton: 'button:contains("Add employer details")',
  addOffenceDetailsButton: 'button:contains("Add offence details")',
  nestedFlowButton: 'button.nested-flow',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  cancelLink: 'a.govuk-link.button-link',
  inlineError: '.govuk-error-message, .govuk-form-group--error .govuk-error-message',
} as const;
