export interface IOpalFinesDefendantAccountSearchParams {
  search_type: 'individual' | 'company' | 'minorCreditor' | 'majorCreditor';
  surname?: string | null;
  exact_match_surname?: boolean | null;

  forename?: string | null;
  exact_match_forenames?: boolean | null;

  initials?: string | null;
  date_of_birth?: string | null;
  address_line?: string | null;
  postcode?: string | null;
  ni_number?: string | null;

  include_aliases?: boolean | null;

  organisation_name?: string | null;
  exact_match_organisation_name?: boolean | null;

  pcr?: string | null;
  account_number?: string | null;

  major_creditor?: string | null;
  till_number?: string | null;
  court?: string | null;

  business_unit_ids?: number[] | null;
  active_accounts_only?: boolean;
}
