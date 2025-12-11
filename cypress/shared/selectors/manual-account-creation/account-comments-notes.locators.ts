export const ManualAccountCommentsNotesLocators = {
  pageHeader: 'h1.govuk-heading-l',
  addAccountNoteLabel: '.govuk-caption-l',
  commentInput: 'textarea[id="fm_account_comments_notes_comments"]',
  noteInput: '#fm_account_comments_notes_notes',
  cancelLink: 'a.govuk-link.button-link',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  reviewAndSubmitButton: 'button[type="submit"]:contains("Review and submit account details")',
} as const;
