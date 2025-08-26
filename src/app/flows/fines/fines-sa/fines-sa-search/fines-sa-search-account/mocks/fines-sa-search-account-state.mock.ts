import { IFinesSaSearchAccountState } from '../interfaces/fines-sa-search-account-state.interface';

export const FINES_SA_SEARCH_ACCOUNT_STATE_MOCK: IFinesSaSearchAccountState = {
  fsa_search_account_business_unit_ids: [1, 2],
  fsa_search_account_number: 'ACC12345678',
  fsa_search_account_reference_case_number: 'REF987654321',
  fsa_search_account_individuals_search_criteria: {
    fsa_search_account_individuals_last_name: 'Doe',
    fsa_search_account_individuals_last_name_exact_match: true,
    fsa_search_account_individuals_first_names: 'John',
    fsa_search_account_individuals_first_names_exact_match: false,
    fsa_search_account_individuals_include_aliases: true,
    fsa_search_account_individuals_date_of_birth: '1990-01-01',
    fsa_search_account_individuals_national_insurance_number: 'QQ123456C',
    fsa_search_account_individuals_address_line_1: '123 Main Street',
    fsa_search_account_individuals_post_code: 'AB1 2CD',
  },
  fsa_search_account_companies_search_criteria: null,
  fsa_search_account_minor_creditors_search_criteria: null,
  fsa_search_account_major_creditor_search_criteria: null,
  fsa_search_account_active_accounts_only: true,
};
