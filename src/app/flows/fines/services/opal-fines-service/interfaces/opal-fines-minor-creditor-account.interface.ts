import { IOpalFinesMinorCreditorDefendant } from './opal-fines-minor-creditor-defendant.interface';

export interface IOpalFinesMinorCreditorAccount {
  organisation: boolean | null;
  creditor_account_id: number | null;
  account_number: string | null;
  address_line_1: string | null;
  postcode: string | null;
  business_unit_name: string | null;
  business_unit_id: string;
  defendant: IOpalFinesMinorCreditorDefendant | null;
  defendant_account_id: number | null;
  account_balance: number | null;
  firstnames: string | null;
  surname: string | null;
  organisation_name: string | null;
}
