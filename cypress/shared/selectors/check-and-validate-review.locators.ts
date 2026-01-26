/**
 * @file check-and-validate-review.locators.ts
 * @description Stable selectors for Check and Validate draft account review, decision, and deletion pages.
 */
export const CheckAndValidateReviewLocators = {
  header: 'h1.govuk-heading-l',
  backLink: 'a.govuk-back-link',
  statusTag: '#status',
  decision: {
    group: 'fieldset#fm_review_account_decision',
    approveRadio: 'input[name="fm_review_account_decision"][value="approve"]',
    rejectRadio: 'input[name="fm_review_account_decision"][value="reject"]',
    reasonInput: '#fm_review_account_decision_reason',
    continueButton: '#submitForm',
    deleteLink: 'a.govuk-link.govuk-error-colour',
  },
  deleteConfirmation: {
    header: 'h1.govuk-heading-l',
    reasonInput: '#fm_delete_account_confirmation_reason',
    confirmButton: '#confirmDeletion',
    cancelLink: 'a.govuk-link.button-link',
  },
  banner: {
    success: 'opal-lib-moj-alert[type="success"], div[opal-lib-moj-alert][type="success"]',
    error: 'div[opal-lib-moj-alert]',
    content: 'opal-lib-moj-alert-content-text',
  },
  timeline: {
    items: '.moj-timeline__item',
    title: '.moj-timeline__title',
    description: '.moj-timeline__description, span[description]',
  },
} as const;
