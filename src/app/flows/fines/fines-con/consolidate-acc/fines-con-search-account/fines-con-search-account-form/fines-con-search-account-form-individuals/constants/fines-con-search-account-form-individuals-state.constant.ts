import { IFinesConSearchAccountFormIndividualsState } from '../interfaces/fines-con-search-account-form-individuals-state.interface';

/**
 * Initial state for the individuals search account form.
 * All individual-specific fields are initialized to null, except booleans which are false.
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE: IFinesConSearchAccountFormIndividualsState = {
  fcon_search_account_individuals_last_name: null,
  fcon_search_account_individuals_last_name_exact_match: false,
  fcon_search_account_individuals_first_names: null,
  fcon_search_account_individuals_first_names_exact_match: false,
  fcon_search_account_individuals_include_aliases: false,
  fcon_search_account_individuals_date_of_birth: null,
  fcon_search_account_individuals_address_line_1: null,
  fcon_search_account_individuals_post_code: null,
};
