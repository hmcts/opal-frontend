export interface IOpalFinesCentralFund {
  business_unit_details: {
    business_unit_id: string;
    business_unit_name: string;
    welsh_speaking: string;
  };
  major_creditor: {
    account_number: string;
    creditor_account_id: number;
    name: string | null;
  };
}
