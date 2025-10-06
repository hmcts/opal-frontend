import { error } from 'console';

export const DOM_ELEMENTS = {
  pageTitle: 'h1.govuk-heading-l',
  addAccountNoteLabel: '.govuk-caption-l',
  commentLabel: 'label[for="fm_account_comments_notes_comments"]',
  commentHint: 'div[id = "fm_account_comments_notes_comments-hint"]',
  commentCharHint: 'div[id = "fm_account_comments_notes_comments-hint"]',
  commentInput: 'textarea[id="fm_account_comments_notes_comments"]',
  noteLabel: 'label[for="fm_account_comments_notes_notes"]',
  noteHint: 'div[id = "fm_account_comments_notes_notes-hint"]',
  noteCharHint: 'div[id = "fm_account_comments_notes_notes-hint"]',
  noteInput: 'textarea[id="fm_account_comments_notes_notes"]',
  addNoteTextBox: 'textarea[id="facc_add_notes"]',
  characterHint: 'textarea[id="facc_add_notes"] + div',
  saveNoteButton: 'button[type="submit"]:contains("Save note")',
  submitButton: 'button[type="submit"]:contains("Return to account details")',
  reviewAndSubmitButton: 'button[type="submit"]:contains("Review and submit account details")',
  cancelLink: 'a.govuk-link.button-link',
  app: 'app-fines-mac-account-comments-notes-form',
  addNoteApp: 'app-fines-acc-note-add-form',
  errorSummary: 'p#facc_add_notes-error-message',
  errorMessage: 'div.govuk-error-summary__body',
};
