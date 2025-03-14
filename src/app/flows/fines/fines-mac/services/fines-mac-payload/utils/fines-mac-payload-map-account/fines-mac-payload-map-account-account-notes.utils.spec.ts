import { finesMacPayloadMapAccountAccountNotesPayload } from './fines-mac-payload-map-account-account-notes.utils';
import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacPayloadAccountAccountNote } from '../interfaces/fines-mac-payload-account-account-note.interface';

describe('finesMacPayloadMapAccountAccountNotesPayload', () => {
  let initialState: IFinesMacState | null;

  beforeEach(() => {
    initialState = {
      accountCommentsNotes: {
        formData: {
          fm_account_comments_notes_comments: '',
          fm_account_comments_notes_notes: '',
        },
      },
    } as IFinesMacState;
  });

  afterAll(() => {
    initialState = null;
  });

  it('should return the initial state if payload is null', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }
    const result = finesMacPayloadMapAccountAccountNotesPayload(initialState, null);
    expect(result).toEqual(initialState);
  });

  it('should map account note with note_type "AC" to fm_account_comments_notes_comments', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }
    const payload: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_text: 'Test comment', account_note_serial: 1, note_type: 'AC' },
    ];
    const result = finesMacPayloadMapAccountAccountNotesPayload(initialState, payload);
    expect(result.accountCommentsNotes.formData.fm_account_comments_notes_comments).toBe('Test comment');
  });

  it('should map account note with note_type "AA" and serial 2 to fm_account_comments_notes_notes', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }

    const payload: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_text: 'Test note', account_note_serial: 2, note_type: 'AA' },
    ];
    const result = finesMacPayloadMapAccountAccountNotesPayload(initialState, payload);
    expect(result.accountCommentsNotes.formData.fm_account_comments_notes_notes).toBe('Test note');
  });

  it('should not map account note with note_type "AA" and serial not equal to 2', () => {
    if (!initialState) {
      fail('Initial state is not properly initialised');
      return;
    }
    const payload: IFinesMacPayloadAccountAccountNote[] = [
      { account_note_text: 'Test note', account_note_serial: 1, note_type: 'AA' },
    ];
    const result = finesMacPayloadMapAccountAccountNotesPayload(initialState, payload);
    expect(result.accountCommentsNotes.formData.fm_account_comments_notes_notes).toBe('');
  });
});
