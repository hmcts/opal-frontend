import { IFinesMacAccountCommentsNotesState } from '../../../../fines-mac-account-comments-notes/interfaces/fines-mac-account-comments-notes-state.interface';
import { finesMacPayloadBuildAccountAccountNotes } from './fines-mac-payload-build-account-account-notes.utils';
import { IFinesMacPayloadAccountAccountNote } from '../interfaces/fines-mac-payload-account-account-note.interface';

describe('finesMacPayloadBuildAccountAccountNotes', () => {
  it('should return an array of account notes when comments and notes are provided', () => {
    const accountCommentsNotesState: IFinesMacAccountCommentsNotesState = {
      fm_account_comments_notes_comments: 'Test comment',
      fm_account_comments_notes_notes: 'Test note',
    };

    const result = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const expectedResult: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_serial: 3, account_note_text: 'Test comment', note_type: 'AC' },
      { account_note_serial: 2, account_note_text: 'Test note', note_type: 'AA' },
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should return null when no comments or notes are provided', () => {
    const accountCommentsNotesState: IFinesMacAccountCommentsNotesState = {
      fm_account_comments_notes_comments: null,
      fm_account_comments_notes_notes: null,
    };

    const result = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    expect(result).toBeNull();
  });

  it('should return an array with only comments when only comments are provided', () => {
    const accountCommentsNotesState: IFinesMacAccountCommentsNotesState = {
      fm_account_comments_notes_comments: 'Only comment',
      fm_account_comments_notes_notes: null,
    };

    const result = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const expectedResult: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_serial: 3, account_note_text: 'Only comment', note_type: 'AC' },
    ];

    expect(result).toEqual(expectedResult);
  });

  it('should return an array with only notes when only notes are provided', () => {
    const accountCommentsNotesState: IFinesMacAccountCommentsNotesState = {
      fm_account_comments_notes_comments: null,
      fm_account_comments_notes_notes: 'Only note',
    };

    const result = finesMacPayloadBuildAccountAccountNotes(accountCommentsNotesState);
    const expectedResult: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_serial: 2, account_note_text: 'Only note', note_type: 'AA' },
    ];

    expect(result).toEqual(expectedResult);
  });
});
