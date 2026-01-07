import { IOpalFinesDefendantAccountAlias } from './opal-fines-defendant-account-alias.interface';

export interface IOpalFinesDefendantAccount {
  defendant_account_id: number | null;
  account_number: string | null;
  organisation_flag: boolean | null;
  aliases: IOpalFinesDefendantAccountAlias[] | null;
  address_line_1: string | null;
  postcode: string | null;
  business_unit_name: string | null;
  business_unit_id: string | null;
  prosecutor_case_reference: string | null;
  last_enforcement_action: string | null;
  account_balance: number | null;
  organisation_name: string | null;
  defendant_title: string | null;
  defendant_firstnames: string | null;
  defendant_surname: string | null;
  birth_date: string | null;
  national_insurance_number: string | null;
  parent_guardian_surname: string | null;
  parent_guardian_firstnames: string | null;
}
