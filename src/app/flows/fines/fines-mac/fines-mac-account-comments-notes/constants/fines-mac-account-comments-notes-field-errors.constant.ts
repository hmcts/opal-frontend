import { IFinesMacAccountCommentsNotesFieldErrors } from '../interfaces/fines-mac-account-comments-notes-field-errors.interface';

export const FINES_MAC_ACCOUNT_COMMENTS_NOTES_FIELD_ERRORS: IFinesMacAccountCommentsNotesFieldErrors = {
  fm_account_comments_notes_comments: {
    singleAsciiChatacters: {
      message: `Add comment must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)`,
      priority: 1,
    },
  },
  fm_account_comments_notes_notes: {
    singleAsciiChatacters: {
      message: `Add account note must only include letters a to z, numbers 0-9 and certain special characters (such as hyphens, spaces, apostrophes and commas)`,
      priority: 1,
    },
  },
};
