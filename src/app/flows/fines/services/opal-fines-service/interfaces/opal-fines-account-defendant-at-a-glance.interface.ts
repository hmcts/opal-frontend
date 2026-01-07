import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';
import { IOpalFinesDefendantAccountEnforcementStatus } from './opal-fines-defendant-account-enforcement-status.interface';
import { IOpalFinesDefendantAccountLanguagePreferences } from './opal-fines-defendant-account-language-preferences.interface';
import { IOpalFinesDefendantAccountNotes } from './opal-fines-defendant-account-notes.interface';
import { IOpalFinesDefendantAccountPartyDetails } from './opal-fines-defendant-account-party-details.interface';
import { IOpalFinesDefendantAccountPaymentTermsSummary } from './opal-fines-defendant-account-payment-terms-summary.interface';

export interface IOpalFinesAccountDefendantAtAGlance {
  version: string | null;
  defendant_account_id: string;
  account_number: string;
  debtor_type: string;
  is_youth: boolean;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
  payment_terms: IOpalFinesDefendantAccountPaymentTermsSummary;
  enforcement_status: IOpalFinesDefendantAccountEnforcementStatus;
  comments_and_notes: IOpalFinesDefendantAccountNotes | null;
}
