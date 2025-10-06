import { IOpalFinesAddNotePayload } from '../interfaces/opal-fines-add-note.interface';

/**
 * Mock data for OpalFines add note payload
 */
export const OPAL_FINES_ADD_NOTE_PAYLOAD_MOCK: IOpalFinesAddNotePayload = {
  activity_note: {
    record_type: 'defendant_account',
    record_id: 12345,
    note_type: 'General',
    note_text: 'This is a test note for the defendant account.',
  },
};
