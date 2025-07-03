import { IFinesSaSearchAccountState } from '../../../../../src/app/flows/fines/fines-sa/fines-sa-search/fines-sa-search-account/interfaces/fines-sa-search-account-state.interface';

export const INDIVIDUAL_SEARCH_STATE_MOCK: IFinesSaSearchAccountState = {
  fsa_search_account_business_unit_ids: null,
  fsa_search_account_number: '12345678',
  fsa_search_account_reference_case_number: 'REF-123-456',
  fsa_search_account_individual_search_criteria: {
    fsa_search_account_individuals_last_name: 'Smith',
    fsa_search_account_individuals_last_name_exact_match: true,
    fsa_search_account_individuals_first_names: 'John',
    fsa_search_account_individuals_first_names_exact_match: true,
    fsa_search_account_individuals_include_aliases: true,
    fsa_search_account_individuals_date_of_birth: '1980-05-15',
    fsa_search_account_individuals_national_insurance_number: 'AB123456C',
    fsa_search_account_individuals_address_line_1: '123 Test Street',
    fsa_search_account_individuals_post_code: 'SW1A 1AA',
  },
  fsa_search_account_companies_search_criteria: null,
  fsa_search_account_minor_creditor_search_criteria: null,
  fsa_search_account_major_creditor_search_criteria: null,
  fsa_search_account_active_accounts_only: true,
};
