import { IOpalFinesVersion } from '../../../services/opal-fines-service/interfaces/opal-fines-version.interface';

export interface IOpalFinesAccountMajorCreditorDetailsHeader extends IOpalFinesVersion {
  major_creditor: {
    account_number: string;
    account_reference: {
      account_type: string;
      display_name: string;
    };
    creditor_account_id: number;
    name: string;
  };
  business_unit_details: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  awaiting_payout: number;
}
