export interface IOpalFinesAccountMinorCreditorDetailsHeader {
  version: string | null;
  creditor_account_id: number;
  account_number: string;
  creditor_account_type: {
    type: string;
    display_name: string;
  };
  business_unit_summary: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  party_details: {
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
  awarded_amount: number;
  paid_out_amount: number;
  awaiting_payout_amount: number;
  outstanding_amount: number;
  has_associated_defendant: boolean;
}
