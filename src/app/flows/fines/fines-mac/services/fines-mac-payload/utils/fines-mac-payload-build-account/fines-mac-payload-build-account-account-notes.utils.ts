import { IFinesMacAccountCommentsNotesState } from '../../../../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-state.interface';
import { IFinesMacPayloadAccountAccountNote } from './interfaces/fines-mac-payload-account-account-note.interface';

/**
 * Builds an account note object for fines management.
 *
 * @param noteSerial - The serial number of the account note.
 * @param accountNoteText - The text content of the account note. Can be null.
 * @param noteType - The type/category of the note.
 * @returns An object representing the account note.
 */
const buildAccountNote = (
  noteSerial: number,
  accountNoteText: string | null,
  noteType: string,
): IFinesMacPayloadAccountAccountNote => {
  return {
    account_note_serial: noteSerial,
    account_note_text: accountNoteText,
    note_type: noteType,
  };
};

/**
 * Builds an array of account notes based on the provided account comments and notes state.
 *
 * @param accountCommentsNotesState - The state containing account comments and notes.
 * @returns An array of account notes if any are present, otherwise null.
 */
export const finesMacPayloadBuildAccountAccountNotes = (
  accountCommentsNotesState: IFinesMacAccountCommentsNotesState,
): IFinesMacPayloadAccountAccountNote[] | null => {
  const accountNotes: IFinesMacPayloadAccountAccountNote[] = [];
  const { fm_account_comments_notes_comments: comments, fm_account_comments_notes_notes: notes } =
    accountCommentsNotesState;

  const addNote = (type: number, content: string | null, code: string) => {
    if (content) {
      accountNotes.push(buildAccountNote(type, content, code));
    }
  };

  addNote(3, comments, 'AC');
  addNote(2, notes, 'AA');
  // addNote(1, systemNotes, 'AA');

  return accountNotes.length ? accountNotes : null;
};
