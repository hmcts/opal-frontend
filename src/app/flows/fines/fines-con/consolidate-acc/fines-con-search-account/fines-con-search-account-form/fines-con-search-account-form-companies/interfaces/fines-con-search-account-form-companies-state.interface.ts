/**
 * Interface for the consolidated company search criteria state.
 */
export interface IFinesConSearchAccountFormCompaniesState {
  fcon_search_account_companies_company_name: string | null;
  fcon_search_account_companies_company_name_exact_match: boolean | null;
  fcon_search_account_companies_include_aliases: boolean | null;
  fcon_search_account_companies_address_line_1: string | null;
  fcon_search_account_companies_post_code: string | null;
}
