/**
 * @file mac.account-comments-notes.locators.ts
 * @description Selector map for the Manual Account Creation **Account comments and notes** task.
 *
 * @remarks
 * - Intended for Cypress actions/flows; avoid hard-coding selectors in specs.
 * - Captures header, textareas, navigation CTAs, and the Review/Submit button.
 */
export const MacAccountCommentsNotesLocators = {
  componentRoot: 'app-fines-mac-account-comments-notes-form',
  pageHeader: 'h1.govuk-heading-l',
  addAccountNoteLabel: '.govuk-caption-l',
  commentLabel: 'label[for="fm_account_comments_notes_comments"]',
  commentHint: '#fm_account_comments_notes_comments-hint',
  commentInput: 'textarea[id="fm_account_comments_notes_comments"]',
  commentCharHint:
    'app-fines-mac-account-comments-notes-form form opal-lib-govuk-text-area:first-of-type .govuk-character-count__message.govuk-character-count__status',
  noteLabel: 'label[for="fm_account_comments_notes_notes"]',
  noteHint: '#fm_account_comments_notes_notes-hint',
  noteInput: '#fm_account_comments_notes_notes',
  noteCharHint: '#fm_account_comments_notes_notes ~ .govuk-character-count__message.govuk-character-count__status',
  cancelLink: 'a.govuk-link.button-link',
  returnToAccountDetailsButton: 'button[type="submit"]:contains("Return to account details")',
  reviewAndSubmitButton: 'button[type="submit"]:contains("Review and submit account details")',
} as const;
