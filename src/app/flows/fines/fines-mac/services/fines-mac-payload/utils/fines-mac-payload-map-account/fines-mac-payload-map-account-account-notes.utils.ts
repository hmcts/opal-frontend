import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';
import { IFinesMacPayloadAccountAccountNote } from '../interfaces/fines-mac-payload-account-account-note.interface';

export const mapAccountAccountNotesPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadAccountAccountNote[] | null,
): IFinesMacState => {
  payload?.forEach((note) => {
    const { account_note_text: accountNoteText, account_note_serial: accountNoteSerial, note_type: noteType } = note;

    switch (noteType) {
      case 'AC':
        mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_comments = accountNoteText;
        break;
      case 'AA':
        if (accountNoteSerial === 2) {
          mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_notes = accountNoteText;
        }
        break;
    }
  });

  return mappedFinesMacState;
};
