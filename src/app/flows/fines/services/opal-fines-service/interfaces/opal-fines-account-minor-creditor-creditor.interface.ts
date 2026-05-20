import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';
import { IOpalFinesDefendantAccountPartyDetails } from './opal-fines-defendant-account-party-details.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountMinorCreditorCreditor extends IOpalFinesVersion {
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  creditor_account_id: string;
  payment: {
    pay_by_bacs: boolean;
    hold_payment: boolean;
    sort_code: string;
    account_number: string;
    account_name: string;
    account_reference: string;
  };
}
