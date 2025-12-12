import { MinorCreditorAccountResponseMinorCreditor } from './generated/opal-fines-minor-creditor-account-response-minor-creditor.interface';
import { MinorCreditorAccountResponseMinorCreditorPayment } from './generated/opal-fines-minor-creditor-account-response-minor-creditor-payment.interface';
import { AddressDetailsCommon } from './generated/opal-fines-address-details-common.interface';
import { PartyDetailsCommon } from './generated/opal-fines-party-details-common.interface';

export interface IOpalFinesMinorCreditorDefendant {
  organisation_name?: string | null;
  firstnames?: string | null;
  surname?: string | null;
}

export interface IOpalFinesMinorCreditorAccount
  extends Omit<MinorCreditorAccountResponseMinorCreditor, 'party_details' | 'address' | 'payment'> {
  party_details?: PartyDetailsCommon & {
    defendant?: IOpalFinesMinorCreditorDefendant | null;
  };
  address?: AddressDetailsCommon | null;
  payment?: MinorCreditorAccountResponseMinorCreditorPayment;
  organisation?: boolean | null;
  business_unit_name?: string | null;
  business_unit_id?: string | null;
  defendant_account_id?: number | null;
  account_balance?: number | null;
  account_number?: string | null;
  address_line_1?: string | null;
  postcode?: string | null;
  firstnames?: string | null;
  surname?: string | null;
  organisation_name?: string | null;
}

export interface IOpalFinesMinorCreditorAccountsResponse {
  count: number;
  creditor_accounts: IOpalFinesMinorCreditorAccount[];
}
