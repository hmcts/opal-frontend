import { GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor } from './generated/opal-fines-get-major-creditor-account-header-summary-response-major-creditor.interface';
import { MajorCreditorAddressDetailsCommon } from './generated/opal-fines-major-creditor-address-details-common.interface';

export interface IOpalFinesMajorCreditor
  extends Partial<
    Omit<GetMajorCreditorAccountHeaderSummaryResponseMajorCreditor, 'creditor_account_id' | 'name' | 'account_number'>
  > {
  account_number?: string | null;
  business_unit_id?: number | null;
  creditor_account_id?: number | null;
  creditor_account_type?: string | null;
  from_suspense?: boolean | null;
  hold_payout?: boolean | null;
  last_changed_date?: string | null;
  major_creditor_code?: string | null;
  code?: string | null;
  major_creditor_id?: number | null;
  major_creditor_party_id?: number | null;
  name?: string | null;
  postcode?: string | null;
  prosecution_service?: boolean | null;
  address?: MajorCreditorAddressDetailsCommon | null;
}

export interface IOpalFinesMajorCreditorRefData {
  count: number;
  refData: IOpalFinesMajorCreditor[];
}
