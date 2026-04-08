/**
 * @file account.enquiry.enforcement-court-change.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Change enforcement court** form.
 *
 * @remarks
 * - Use these selectors in Cypress component and e2e tests to avoid local duplication.
 * - Keys mirror the visible page structure so assertions stay mechanical and readable.
 */
export const DOM_ELEMENTS = {
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  title: 'h1.govuk-heading-l',
  caption: '.govuk-caption-l',
  form: 'form.govuk-form',
  enforcementCourtLabel: 'label[for="facc_enf_court-autocomplete"]',
  enforcementCourtInput: '#facc_enf_court-autocomplete',
  hiddenEnforcementCourtInput: '#facc_enf_court',
  dropdownOptions: '.autocomplete__option',
  submitButton: '#submitForm',
  cancelLink: '.govuk-button-group .govuk-link',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
  fieldError: '#facc_enf_court-autocomplete-error-message',
} as const;
