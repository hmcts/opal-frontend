import { IOpalFinesDefendantAccountAddress } from './opal-fines-defendant-account-address.interface';
import { IOpalFinesDefendantAccountPartyDetails } from './opal-fines-defendant-account-party-details.interface';
import { IOpalFinesVersion } from './opal-fines-version.interface';

export interface IOpalFinesAccountMinorCreditorAtAGlance extends IOpalFinesVersion {
  party: IOpalFinesDefendantAccountPartyDetails;
  address: IOpalFinesDefendantAccountAddress;
  creditor_account_id: string;
  defendant: {
    account_number: string;
    account_id: number;
    title: string;
    forenames: string;
    surname: string;
  } | null;
  payment: {
    is_bacs: boolean;
    hold_payment: boolean;
  };
}
