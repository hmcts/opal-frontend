import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';
import { IOpalFinesDefendantAccountPartyDetails } from './opal-fines-defendant-account-party-details.interface';

export interface IOpalFinesUpdateMinorCreditorAccountPayload {
  creditor_account_id: string;
  party_details: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  payment: {
    account_name: string | null;
    sort_code: string | null;
    account_number: string | null;
    account_reference: string | null;
    pay_by_bacs: boolean;
    hold_payment: boolean;
  };
}
