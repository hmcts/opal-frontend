import { IOpalFinesAddNoteResponse } from '../interfaces/opal-fines-add-note.interface';

/**
 * Mock data for OpalFines add note response
 */
export const OPAL_FINES_ADD_NOTE_RESPONSE_MOCK: IOpalFinesAddNoteResponse = {
  note_id: 67890,
  associated_record_type: 'defendant_account',
  associated_record_id: '12345',
  note_type: 'General',
  note_text: 'This is a test note for the defendant account.',
  created_date: '2025-08-18T14:30:00.000Z',
  created_by: 'test.user@hmcts.net',
};
