/**
 * @file account.convert.locators.ts
 * @description Selector map for the Defendant account convert confirmation page.
 */
export const AccountConvertLocators = {
  page: {
    root: 'main[role="main"]',
    heading: '#account-convert-heading',
    caption: '#account-convert-heading .govuk-caption-l',
    warningText: '#account-convert-warning',
    confirmButton: '#account-convert-confirm',
    cancelLink: '#account-convert-cancel a.govuk-link',
  },
} as const;
