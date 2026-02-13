/**
 * Interface for the consolidated search account state.
 * Contains all form fields for both quick search and defendant-type-specific criteria.
 */
export interface IFinesConSearchAccountState {
  fcon_search_account_number: string | null;
  fcon_search_account_individuals_last_name: string | null;
  fcon_search_account_individuals_last_name_exact_match: boolean | null;
  fcon_search_account_individuals_first_names: string | null;
  fcon_search_account_individuals_first_names_exact_match: boolean | null;
  fcon_search_account_individuals_include_aliases: boolean | null;
  fcon_search_account_individuals_date_of_birth: string | null;
  fcon_search_account_individuals_national_insurance_number: string | null;
  fcon_search_account_individuals_address_line_1: string | null;
  fcon_search_account_individuals_post_code: string | null;
  fcon_search_account_companies_name: string | null;
  fcon_search_account_companies_reference_number: string | null;
}
