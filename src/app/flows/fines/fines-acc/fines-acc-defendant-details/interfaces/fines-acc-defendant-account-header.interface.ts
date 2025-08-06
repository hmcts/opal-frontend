export interface IOpalFinesDefendantAccountHeader {
  id: number;
  business_unit_id: number;
  account_type: string;
  account_number: string;
  prosecutor_case_reference: string;
  title: string;
  firstnames: string;
  surname: string;
  debtor_type: string;
  isYouth: boolean;
  imposed: number;
  arrears: number;
  paid: number;
  account_balance: number;
}
