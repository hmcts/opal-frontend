import { IOpalFinesUpdateDefendantAccountCommentsNotes } from './opal-fines-update-defendant-account-comments-notes.interface';
import { IOpalFinesUpdateDefendantAccountCollectionOrder } from './opal-fines-update-defendant-account-collection-order.interface';
import { IOpalFinesUpdateDefendantAccountEnforcementOverride } from './opal-fines-update-defendant-account-enforcement-override.interface';

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  comment_and_notes?: IOpalFinesUpdateDefendantAccountCommentsNotes | null;
  collection_order?: IOpalFinesUpdateDefendantAccountCollectionOrder | null;
  enforcement_override?: IOpalFinesUpdateDefendantAccountEnforcementOverride | null;
}
