export interface IOpalFinesAccountMinorCreditorDetailsHeader {
  version: string | null;
  creditor: {
    account_id: number;
    account_number: string;
    account_type: {
      type: string;
      display_name: string;
    };
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
  business_unit: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  financials: {
    awarded: number;
    paid_out: number;
    awaiting_payout: number;
    outstanding: number;
  };
}
