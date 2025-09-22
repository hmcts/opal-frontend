import {
  IOpalFinesDefendantAccountAddress,
  IOpalFinesDefendantAccountEnforcementStatus,
  IOpalFinesDefendantAccountLanguagePreferences,
  IOpalFinesDefendantAccountNotes,
  IOpalFinesDefendantAccountPartyDetails,
  IOpalFinesDefendantAccountPaymentTermsSummary,
} from './opal-fines-defendant-account.interface';

export interface IOpalFinesAccountDefendantDetailsAtAGlanceTabRefData {
  version: string;
  defendant_account_id: string;
  account_number: string;
  debtor_type: string;
  is_youth: boolean;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
  payment_terms: IOpalFinesDefendantAccountPaymentTermsSummary;
  enforcement_status: IOpalFinesDefendantAccountEnforcementStatus;
  comment_and_notes: IOpalFinesDefendantAccountNotes | null;
}
