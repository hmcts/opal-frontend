export interface IOpalFinesDefendantAccountSearchParamsDefendant {
  include_aliases: boolean | null;
  organisation: boolean | null;
  address_line_1: string | null;
  postcode: string | null;
  organisation_name: string | null;
  exact_match_organisation_name: boolean | null;
  surname: string | null;
  exact_match_surname: boolean | null;
  forenames: string | null;
  exact_match_forenames: boolean | null;
  birth_date: string | null;
  national_insurance_number: string | null;
}

export interface IOpalFinesDefendantAccountSearchParamsReference {
  account_number: string | null;
  prosecutor_case_reference: string | null;
  organisation: boolean | null;
}

export interface IOpalFinesDefendantAccountSearchParams {
  active_accounts_only: boolean | null;
  business_unit_ids: number[] | null;
  reference_number: IOpalFinesDefendantAccountSearchParamsReference | null;
  defendant: IOpalFinesDefendantAccountSearchParamsDefendant | null;
}
