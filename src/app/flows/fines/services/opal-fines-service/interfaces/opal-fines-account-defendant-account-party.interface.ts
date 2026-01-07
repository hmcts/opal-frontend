import { IOpalFinesAccountPartyDetails } from './opal-fines-account-party-details.interface';

export interface IOpalFinesAccountDefendantAccountParty {
  version: string | null;
  defendant_account_party: IOpalFinesAccountPartyDetails;
}
