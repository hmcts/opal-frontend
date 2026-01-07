import { IOpalFinesCreditorAccountDefendant } from './opal-fines-creditor-account-defendant.interface';

export interface IOpalFinesCreditorAccount {
  organisation: boolean | null;
  creditor_account_id: number | null;
  account_number: string | null;
  address_line_1: string | null;
  postcode: string | null;
  business_unit_name: string | null;
  business_unit_id: string | null;
  defendant: IOpalFinesCreditorAccountDefendant | null;
  defendant_account_id: number | null;
  account_balance: number | null;
  organisation_name: string | null;
  firstnames: string | null;
  surname: string | null;
}
