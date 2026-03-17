/**
 * @file account.convert.locators.ts
 * @description Selector map for the Defendant account convert confirmation page.
 */
export const AccountConvertLocators = {
  page: {
    root: 'main[role="main"]',
    header: 'main[role="main"] h1.govuk-heading-l',
    caption: 'main[role="main"] h1.govuk-heading-l .govuk-caption-l',
    warningText: 'main[role="main"] p.govuk-body',
    confirmButton: 'main[role="main"] button.govuk-button:contains("Yes - continue")',
    cancelLink: 'main[role="main"] a.govuk-link:contains("No - cancel")',
  },
} as const;
