import { IOpalFinesUpdateDefendantAccountCommentsNotes } from './opal-fines-update-defendant-account-comments-notes.interface';
import { IOpalFinesUpdateDefendantAccountEnforcementOverride } from './opal-fines-update-defendant-account-enforcement-override.interface';

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  comment_and_notes?: IOpalFinesUpdateDefendantAccountCommentsNotes;
  enforcement_override?: IOpalFinesUpdateDefendantAccountEnforcementOverride;
}
