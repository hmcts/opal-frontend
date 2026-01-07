import { IOpalFinesUpdateDefendantAccountCommentsNotes } from './opal-fines-update-defendant-account-comments-notes.interface';

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  comment_and_notes: IOpalFinesUpdateDefendantAccountCommentsNotes;
}
