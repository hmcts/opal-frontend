/**
 * @file account.enquiry.enforcement-override-remove.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Remove enforcement override** confirmation page.
 *
 * @remarks
 * - Use these selectors in Cypress tests instead of local component constants.
 * - Keys mirror the visible page structure so assertions stay readable and consistent.
 */
export const DOM_ELEMENTS = {
  title: 'h1.govuk-heading-l',
  removeButton: '#removeEnforcementOverride',
  cancelLink: 'a.govuk-link',
  overrideValue: '.govuk-grid-column-two-thirds p',
} as const;
