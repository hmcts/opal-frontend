import { IOpalFinesVersion } from '../../../services/opal-fines-service/interfaces/opal-fines-version.interface';

export interface IOpalFinesAccountMajorCreditorDetailsHeader extends IOpalFinesVersion {
  major_creditor: {
    account_number: string;
    creditor_account_id: number;
    name: string;
    account_reference: string;
  };
  account_reference: {
    creditor_account_type: string;
    creditor_account_display_name: string;
  };
  business_unit_details: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  awaiting_payout: number;
}
