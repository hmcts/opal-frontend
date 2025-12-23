/**
 * @file check-and-validate-drafts.locators.ts
 * @description Stable selectors for the **Check and Validate Draft Accounts** page (checker view).
 */
export const CheckAndValidateDraftsLocators = {
  header: 'h1.govuk-heading-l',
  tabs: {
    container: '#checker-tabs',
    toReview: '[subnavitemid="checker-to-review-tab"] a',
    rejected: '[subnavitemid="checker-rejected-tab"] a',
    deleted: '[subnavitemid="checker-deleted-tab"] a',
    failed: '[subnavitemid="checker-failed-tab"] a',
    byText: (tabName: string) => `#checker-tabs a:contains("${tabName}")`,
  },
} as const;
