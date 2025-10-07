import {
  IOpalFinesDefendantAccountAddress,
  IOpalFinesDefendantAccountContactDetails,
  IOpalFinesDefendantAccountEmployerDetails,
  IOpalFinesDefendantAccountLanguagePreferences,
  IOpalFinesDefendantAccountPartyDetails,
  IOpalFinesDefendantAccountVehicleDetails,
} from './opal-fines-defendant-account.interface';

export interface IOpalFinesAccountDefendantAccountParty {
  version: string | null;
  defendant_account_party: {
    defendant_account_party_type: string;
    is_debtor: boolean;
    party_details: IOpalFinesDefendantAccountPartyDetails;
    address: IOpalFinesDefendantAccountAddress;
    contact_details: IOpalFinesDefendantAccountContactDetails | null;
    vehicle_details: IOpalFinesDefendantAccountVehicleDetails | null;
    employer_details: IOpalFinesDefendantAccountEmployerDetails | null;
    language_preferences: IOpalFinesDefendantAccountLanguagePreferences | null;
  };
}
