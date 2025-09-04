/**
 * Interface for updating defendant account notes *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountCommentsNotes {
  account_comment: string | null;
  account_free_note_1: string | null;
  account_free_note_2: string | null;
  account_free_note_3: string | null;
}

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  version: number;
  account_comments_notes: IOpalFinesUpdateDefendantAccountCommentsNotes;
}

/**
 * Interface for the response when updating a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountResponse {
  version: number;
  defendant_account_id: number;
  message?: string;
}
