/**
 * Interface for updating defendant account notes *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountCommentsNotes {
  account_comment: string | null;
  free_text_note_1: string | null;
  free_text_note_2: string | null;
  free_text_note_3: string | null;
}

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  comment_and_notes: IOpalFinesUpdateDefendantAccountCommentsNotes;
}

/**
 * Interface for the response when updating a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountResponse {
  defendant_account_id: number;
  message?: string;
}
