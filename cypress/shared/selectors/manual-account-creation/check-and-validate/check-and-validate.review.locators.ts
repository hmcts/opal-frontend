/**
 * @file check-and-validate.review.locators.ts
 * @description Stable selectors for Check and Validate draft account review, decision, and deletion pages.
 */
export const CheckAndValidateReviewLocators = {
  heading: 'h1.govuk-heading-l',
  backLink: 'a.govuk-back-link',
  statusTag: '#status',
  reasonLabel: 'label[for="fm_delete_account_confirmation_reason"]',
  commentInput: '#fm_delete_account_confirmation_reason',
  commentCharHint: 'div.govuk-character-count__message.govuk-character-count__status',
  confirmDeleteButton: '#confirmDeletion',
  cancelLink: 'a.govuk-link.button-link',
  decision: {
    group: 'fieldset#fm_review_account_decision',
    approveRadio: 'input#approve, input[name="fm_review_account_decision"][value="approve"]',
    rejectRadio: 'input#reject, input[name="fm_review_account_decision"][value="reject"]',
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
