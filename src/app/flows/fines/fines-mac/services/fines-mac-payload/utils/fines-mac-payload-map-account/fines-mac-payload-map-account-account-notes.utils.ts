import { IFinesMacState } from '../../../../interfaces/fines-mac-state.interface';

import { IFinesMacPayloadBuildAccountAccountNote } from '../fines-mac-payload-build-account/interfaces/fines-mac-payload-build-account-account-note.interface';

/**
 * Maps the account notes payload to the fines MAC state.
 *
 * @param mappedFinesMacState - The current state of the fines MAC.
 * @param payload - The payload containing account notes to be mapped. Can be null.
 * @returns The updated fines MAC state with the mapped account notes.
 */
export const mapAccountAccountNotesPayload = (
  mappedFinesMacState: IFinesMacState,
  payload: IFinesMacPayloadBuildAccountAccountNote[] | null,
): IFinesMacState => {
  if (!payload) {
    return mappedFinesMacState;
  }

  payload.forEach(({ account_note_text, account_note_serial, note_type }) => {
    switch (note_type) {
      case 'AC':
        mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_comments = account_note_text;
        break;
      case 'AA':
        if (account_note_serial === 2) {
          mappedFinesMacState.accountCommentsNotes.formData.fm_account_comments_notes_notes = account_note_text;
        }
        break;
    }
  });

  return mappedFinesMacState;
};
