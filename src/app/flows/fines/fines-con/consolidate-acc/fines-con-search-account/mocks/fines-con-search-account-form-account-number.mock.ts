import { IFinesConSearchAccountForm } from '../interfaces/fines-con-search-account-form.interface';

/**
 * Mock for FinesConSearchAccountForm with populated account number
 */
export const FINES_CON_SEARCH_ACCOUNT_FORM_ACCOUNT_NUMBER_MOCK: IFinesConSearchAccountForm = {
  formData: {
    fcon_search_account_number: '12345678',
    fcon_search_account_national_insurance_number: null,
    fcon_search_account_individuals_search_criteria: {
      fcon_search_account_individuals_last_name: null,
      fcon_search_account_individuals_last_name_exact_match: false,
      fcon_search_account_individuals_first_names: null,
      fcon_search_account_individuals_first_names_exact_match: false,
      fcon_search_account_individuals_include_aliases: false,
      fcon_search_account_individuals_date_of_birth: null,
      fcon_search_account_individuals_address_line_1: null,
      fcon_search_account_individuals_post_code: null,
    },
    fcon_search_account_companies_search_criteria: {
      fcon_search_account_companies_company_name: null,
      fcon_search_account_companies_company_name_exact_match: false,
      fcon_search_account_companies_include_aliases: false,
      fcon_search_account_companies_address_line_1: null,
      fcon_search_account_companies_post_code: null,
    },
  },
  nestedFlow: false,
};
