import { IOpalFinesAddNotePayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-note.interface';
import { OPAL_FINES_NOTE_RECORD_TYPES } from '@services/fines/opal-fines-service/constants/opal-fines-note-record-types.constant';
import { FINES_ACC_ADD_NOTE_FORM_MOCK } from './fines-acc-add-note-form.mock';

export const FINES_ACC_ADD_NOTE_MINOR_CREDITOR_PAYLOAD_MOCK: IOpalFinesAddNotePayload = {
  activity_note: {
    record_type: OPAL_FINES_NOTE_RECORD_TYPES.minorCreditorAccounts,
    record_id: 12345,
    note_type: 'AA',
    note_text: FINES_ACC_ADD_NOTE_FORM_MOCK.formData.facc_add_notes!,
  },
};
