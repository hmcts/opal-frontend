import { IFinesSaSearchAccountState } from '../../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';

export const COMPANY_SEARCH_STATE_MOCK: IFinesSaSearchAccountState = {
  fsa_search_account_business_unit_ids: null,
  fsa_search_account_number: '',
  fsa_search_account_reference_case_number: '',
  fsa_search_account_individuals_search_criteria: {
    fsa_search_account_individuals_last_name: '',
    fsa_search_account_individuals_last_name_exact_match: false,
    fsa_search_account_individuals_first_names: '',
    fsa_search_account_individuals_first_names_exact_match: false,
    fsa_search_account_individuals_include_aliases: false,
    fsa_search_account_individuals_date_of_birth: '',
    fsa_search_account_individuals_national_insurance_number: '',
    fsa_search_account_individuals_address_line_1: '',
    fsa_search_account_individuals_post_code: '',
  },
  fsa_search_account_companies_search_criteria: {
    fsa_search_account_companies_company_name: '',
    fsa_search_account_companies_company_name_exact_match: false,
    fsa_search_account_companies_include_aliases: false,
    fsa_search_account_companies_address_line_1: '',
    fsa_search_account_companies_post_code: '',
  },
  fsa_search_account_minor_creditors_search_criteria: null,
  fsa_search_account_major_creditors_search_criteria: null,
  fsa_search_account_active_accounts_only: true,
};
