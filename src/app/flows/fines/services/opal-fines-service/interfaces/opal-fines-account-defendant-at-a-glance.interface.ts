import { GetDefendantAccountHeaderSummaryResponse } from './generated/opal-fines-get-defendant-account-header-summary-response.interface';
import { PaymentStateSummaryCommon } from './generated/opal-fines-payment-state-summary-common.interface';
import { CommentsAndNotesCommon } from './generated/opal-fines-comments-and-notes-common.interface';
import {
  IOpalFinesDefendantAccountAddress,
  IOpalFinesDefendantAccountEnforcementStatus,
  IOpalFinesDefendantAccountLanguagePreferences,
  IOpalFinesDefendantAccountNotes,
  IOpalFinesDefendantAccountPartyDetails,
  IOpalFinesDefendantAccountPaymentTermsSummary,
} from './opal-fines-defendant-account.interface';

export interface IOpalFinesAccountDefendantAtAGlance extends GetDefendantAccountHeaderSummaryResponse {
  version: string | null;
  payment_state_summary: PaymentStateSummaryCommon;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
  payment_terms: IOpalFinesDefendantAccountPaymentTermsSummary;
  enforcement_status: IOpalFinesDefendantAccountEnforcementStatus;
  comments_and_notes: IOpalFinesDefendantAccountNotes | CommentsAndNotesCommon | null;
}
