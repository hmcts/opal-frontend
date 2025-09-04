export interface IOpalFinesDefendantAccountAlias {
  alias_number: number | null;
  organisation_name: string | null;
  surname: string | null;
  forenames: string | null;
}

export interface IOpalFinesDefendantAccount {
  defendant_account_id: string | null;
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

export interface IOpalFinesDefendantAccountResponse {
  count: number;
  defendant_accounts: IOpalFinesDefendantAccount[];
}
