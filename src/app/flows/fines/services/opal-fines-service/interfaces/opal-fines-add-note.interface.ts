/**
 * Interface for adding a note payload
 */
export interface IOpalFinesAddNotePayload {
  activity_note: {
    record_type: string;
    record_id: number;
    note_type: string;
    note_text: string;
  };
}
