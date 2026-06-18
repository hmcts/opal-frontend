/**
 * @file account.enquiry.enforcement-action-select.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Enforcement Actions form.
 */

export const DOM_ELEMENTS = {
  informationBanner: 'opal-lib-moj-alert',
  informationBannerListItems: 'opal-lib-moj-alert li',
  headingWithCaption: 'opal-lib-govuk-heading-with-caption',
  pageTitle: 'opal-lib-govuk-heading-with-caption > h1',
  accountInfo: 'opal-lib-govuk-heading-with-caption .govuk-caption-l',
  actionDropdownLabel: '.govuk-fieldset__legend--m',
  actionDropdown: '[name="facc_enf_action-autocomplete"]',
  actionDropdownOptions: '#facc_enf_action-autocomplete__listbox .autocomplete__option',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  errorSummaryList: '.govuk-error-summary__list',
  actionDropdownError: '.govuk-error-message',
  continueButton: '#submitForm',
  cancelLink: '.govuk-link',

  newEnforcementActionButton: '#submitForm',
  newEnforcementActionPageTitle: 'opal-lib-govuk-heading-with-caption > h1',
  newEnforcementActionAccountInfo: 'opal-lib-govuk-heading-with-caption .govuk-caption-l',
  newEnforcementActionSuccessBanner: 'opal-lib-moj-alert-content-text',

  newEnforcementActionRadioGroup: '.govuk-radios',
  newEnforcementActionYesRadio: '#facc_enf_action_add_new-facc_enf_action_add_new_yes',
  newEnforcementActionNoRadio: '#facc_enf_action_add_new-facc_enf_action_add_new_no',

  newEnforcementActionContinueButton: '#submitForm',
  newEnforcementActionErrorSummary: 'opal-lib-govuk-error-summary',
  newEnforcementActionErrorMessage: '#facc_enf_action_add_new-error-message',
} as const;
