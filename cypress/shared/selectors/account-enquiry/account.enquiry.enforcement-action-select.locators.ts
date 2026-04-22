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
  actionDropdown: '[name="facc_enf_action-autocomplete"]',
  actionDropdownOptions: '#facc_enf_action-autocomplete__listbox .autocomplete__option',
  continueButton: '#submitForm',
  cancelLink: '.govuk-link',
} as const;
