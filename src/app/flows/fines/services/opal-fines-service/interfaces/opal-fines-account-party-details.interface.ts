import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';
import { IOpalFinesDefendantAccountContactDetails } from './opal-fines-defendant-account-contact-details.interface';
import { IOpalFinesDefendantAccountEmployerDetails } from './opal-fines-defendant-account-employer-details.interface';
import { IOpalFinesDefendantAccountLanguagePreferences } from './opal-fines-defendant-account-language-preferences.interface';
import { IOpalFinesDefendantAccountPartyDetails } from './opal-fines-defendant-account-party-details.interface';
import { IOpalFinesDefendantAccountVehicleDetails } from './opal-fines-defendant-account-vehicle-details.interface';

export interface IOpalFinesAccountPartyDetails {
  defendant_account_party_type: string;
  is_debtor: boolean;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  contact_details: IOpalFinesDefendantAccountContactDetails | null;
  vehicle_details: IOpalFinesDefendantAccountVehicleDetails | null;
  employer_details: IOpalFinesDefendantAccountEmployerDetails | null;
  language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
}
