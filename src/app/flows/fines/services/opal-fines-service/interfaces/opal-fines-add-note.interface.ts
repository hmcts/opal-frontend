/**
 * Interface for adding a note payload
 */
export interface IOpalFinesAddNotePayload {
  account_version: number; // Optional field for account version
  associated_record_type: string;
  associated_record_id: string;
  note_type: string;
  note_text: string;
}

/**
 * Interface for the response after adding a note
 */
export interface IOpalFinesAddNoteResponse {
  note_id: number;
  associated_record_type: string;
  associated_record_id: string;
  note_type: string;
  note_text: string;
  created_date: string;
  created_by: string;
}
