import { IFinesConSearchAccountFormCompaniesState } from '../interfaces/fines-con-search-account-form-companies-state.interface';

/**
 * Initial/default state for the companies search form.
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_STATE: IFinesConSearchAccountFormCompaniesState = {
  fcon_search_account_companies_company_name: null,
  fcon_search_account_companies_company_name_exact_match: false,
  fcon_search_account_companies_include_aliases: false,
  fcon_search_account_companies_address_line_1: null,
  fcon_search_account_companies_post_code: null,
};
