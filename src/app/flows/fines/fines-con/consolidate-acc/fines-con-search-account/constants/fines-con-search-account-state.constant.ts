import { IFinesConSearchAccountState } from '../interfaces/fines-con-search-account-state.interface';

/**
 * Initial state for the search account form.
 * All fields are initialized to null.
 */
export const FINES_CON_SEARCH_ACCOUNT_STATE: IFinesConSearchAccountState = {
  fcon_search_account_number: null,
  fcon_search_account_individuals_last_name: null,
  fcon_search_account_individuals_last_name_exact_match: null,
  fcon_search_account_individuals_first_names: null,
  fcon_search_account_individuals_first_names_exact_match: null,
  fcon_search_account_individuals_include_aliases: null,
  fcon_search_account_individuals_date_of_birth: null,
  fcon_search_account_individuals_national_insurance_number: null,
  fcon_search_account_individuals_address_line_1: null,
  fcon_search_account_individuals_post_code: null,
  fcon_search_account_companies_name: null,
  fcon_search_account_companies_reference_number: null,
};
