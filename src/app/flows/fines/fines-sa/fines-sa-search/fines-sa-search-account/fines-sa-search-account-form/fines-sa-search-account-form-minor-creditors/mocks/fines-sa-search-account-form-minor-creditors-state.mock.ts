import { IFinesSaSearchAccountFormMinorCreditorsState } from '../interfaces/fines-sa-search-account-form-minor-creditors-state.interface';

export const FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE_MOCK: IFinesSaSearchAccountFormMinorCreditorsState = {
  fsa_search_account_minor_creditors_minor_creditor_type: 'individual',
  fsa_search_account_minor_creditors_individual: {
    fsa_search_account_minor_creditors_last_name: 'Smith',
    fsa_search_account_minor_creditors_last_name_exact_match: true,
    fsa_search_account_minor_creditors_first_names: 'Jane',
    fsa_search_account_minor_creditors_first_names_exact_match: false,
    fsa_search_account_minor_creditors_individual_address_line_1: '456 High Street',
    fsa_search_account_minor_creditors_individual_post_code: 'ZX9 9ZZ',
  },
  fsa_search_account_minor_creditors_company: {
    fsa_search_account_minor_creditors_company_name: 'Example Co.',
    fsa_search_account_minor_creditors_company_name_exact_match: false,
    fsa_search_account_minor_creditors_company_address_line_1: '123 Business Road',
    fsa_search_account_minor_creditors_company_post_code: 'AB1 2CD',
  },
};
