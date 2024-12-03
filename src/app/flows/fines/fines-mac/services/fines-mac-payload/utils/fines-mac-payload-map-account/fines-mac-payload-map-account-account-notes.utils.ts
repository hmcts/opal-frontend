import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';
import { IFinesMacAddAccountPayload } from '../../interfaces/fines-mac-payload-add-account.interfaces';

export const mapAccountAccountNotesPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacAddAccountPayload,
): IFinesMacState => {
  const accountNotesPayload = payload.account.account_notes;

  accountNotesPayload?.forEach((note) => {
    const { account_note_text: accountNoteText, account_note_serial: accountNoteSerial, note_type: noteType } = note;

    switch (noteType) {
      case 'AC':
        mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_comments = accountNoteText;
        break;
      case 'AA':
        if (accountNoteSerial === 2) {
          mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_comments = accountNoteText;
        }
        break;
    }
  });

  return mappedFinesMacState;
};
