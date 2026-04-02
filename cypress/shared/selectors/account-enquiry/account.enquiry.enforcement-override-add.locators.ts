/**
 * @file account.enquiry.enforcement-override-add.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Add enforcement override** form.
 * Covers page headings, autocomplete controls, actions, and validation summary.
 *
 * @remarks
 * - Use these selectors in Cypress tests instead of local component constants.
 * - The exported key names are preserved to keep migration of existing specs mechanical.
 */
export const DOM_ELEMENTS = {
  title: 'h1.govuk-heading-l',
  subtitle: '.govuk-fieldset__legend--m',
  enfOverrideDropdown: '[name="fenf_account_enforcement_action-autocomplete"]',
  enforcerDropdown: '[name="fenf_account_enforcement_enforcer-autocomplete"]',
  localJusticeAreaDropdown: '[name="fenf_account_enforcement_lja-autocomplete"]',
  dropdownOptions: '.autocomplete__option',
  addOverrideButton: '#submitForm',
  cancelLink: '.govuk-link',
  errorSummary: '.govuk-error-summary__title',
} as const;
