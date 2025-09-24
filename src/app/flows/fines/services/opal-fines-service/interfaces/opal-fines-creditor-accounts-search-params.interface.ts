export interface IOpalFinesCreditorAccountsSearchParamsCreditor {
  address_line_1: string | null;
  postcode: string | null;
  organisation_name: string | null;
  exact_match_organisation_name: boolean | null;
  surname: string | null;
  exact_match_surname: boolean | null;
  forenames: string | null;
  exact_match_forenames: boolean | null;
  organisation: boolean | null;
}

export interface IOpalFinesCreditorAccountsSearchParams {
  business_unit_ids: number[] | null;
  active_accounts_only: boolean | null;
  account_number: string | null;
  creditor: IOpalFinesCreditorAccountsSearchParamsCreditor | null;
}
