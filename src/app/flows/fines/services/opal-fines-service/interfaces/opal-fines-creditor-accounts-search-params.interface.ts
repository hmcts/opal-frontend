export interface IMinorCreditorOrganisationSearch {
  organisation: boolean | null;
  organisation_name: string | null;
  exact_match_organisation_name: boolean | null;
  address_line_1: string | null;
  postcode: string | null;
}

export interface IMinorCreditorIndividualSearch {
  organisation: boolean | null;
  surname: string | null;
  exact_match_surname: boolean | null;
  forenames: string | null;
  exact_match_forenames: boolean | null;
  address_line_1: string | null;
  postcode: string | null;
}

export type IMinorCreditorSearchParams = IMinorCreditorOrganisationSearch | IMinorCreditorIndividualSearch;

export interface IOpalFinesCreditorAccountsSearchParams {
  business_unit_ids: number[] | null;
  active_accounts_only: boolean | null;
  account_number: string | null;
  creditor: IMinorCreditorSearchParams | null;
}
