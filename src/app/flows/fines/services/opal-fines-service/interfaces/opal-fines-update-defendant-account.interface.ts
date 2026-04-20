import { IOpalFinesUpdateDefendantAccountCommentsNotes } from './opal-fines-update-defendant-account-comments-notes.interface';
import { IOpalFinesUpdateDefendantAccountEnforcementCourt } from './opal-fines-update-defendant-account-enforcement-court.interface';
import { IOpalFinesUpdateDefendantAccountCollectionOrder } from './opal-fines-update-defendant-account-collection-order.interface';
import { IOpalFinesUpdateDefendantAccountEnforcementOverride } from './opal-fines-update-defendant-account-enforcement-override.interface';

/**
 * Interface for the payload to update a defendant account *Subject to change
 */
export interface IOpalFinesUpdateDefendantAccountPayload {
  comment_and_notes?: IOpalFinesUpdateDefendantAccountCommentsNotes;
  enforcement_court?: IOpalFinesUpdateDefendantAccountEnforcementCourt;
  collection_order?: IOpalFinesUpdateDefendantAccountCollectionOrder;
  enforcement_override?: IOpalFinesUpdateDefendantAccountEnforcementOverride;
}
