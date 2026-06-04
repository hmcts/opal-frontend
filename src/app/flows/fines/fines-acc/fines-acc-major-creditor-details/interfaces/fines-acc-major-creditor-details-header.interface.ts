import { IOpalFinesVersion } from '../../../services/opal-fines-service/interfaces/opal-fines-version.interface';

export interface IOpalFinesAccountMajorCreditorDetailsHeader extends IOpalFinesVersion {
  creditor: {
    account_id: number;
    account_number: string;
    account_type: {
      type: string;
      display_name: string;
    };
    has_associated_defendant: boolean;
  };
  business_unit: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  party: {
    party_id: string;
    organisation_flag: boolean;
    organisation_details?: {
      organisation_name: string;
      organisation_aliases: string | null;
    };
    individual_details?: {
      title: string;
      forenames: string;
      surname: string;
    };
  };
  financials: {
    awarded: number;
    paid_out: number;
    awaiting_payout: number;
    outstanding: number;
  };
}
