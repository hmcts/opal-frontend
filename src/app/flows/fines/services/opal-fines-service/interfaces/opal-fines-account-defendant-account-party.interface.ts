import { IOpalFinesAccountPartyDetails } from './opal-fines-account-party-details.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountDefendantAccountParty extends IOpalFinesVersion {
  defendant_account_party: IOpalFinesAccountPartyDetails;
}
