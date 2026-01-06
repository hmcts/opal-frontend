/**
 * @file create-manage-drafts.locators.ts
 * @description Stable selectors for the **Create and Manage Draft Accounts** page (inputter view).
 */
export const CreateManageDraftsLocators = {
  header: 'h1.govuk-heading-l',
  backLink: 'a.govuk-back-link',
  tabs: {
    container: '#inputter-tabs',
    inReview: '[subnavitemid="inputter-in-review-tab"] a',
    rejected: '[subnavitemid="inputter-rejected-tab"] a',
    approved: '[subnavitemid="inputter-approved-tab"] a',
    deleted: '[subnavitemid="inputter-deleted-tab"] a',
    byText: (tabName: string) => `#inputter-tabs a:contains("${tabName}")`,
  },
} as const;
