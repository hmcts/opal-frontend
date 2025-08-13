import { FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE } from '../fines-sa-search-account-form/fines-sa-search-account-form-companies/constants/fines-sa-search-account-form-companies-state.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE } from '../fines-sa-search-account-form/fines-sa-search-account-form-individuals/constants/fines-sa-search-account-form-individuals-state.constant';
import { FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE } from '../fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/constants/fines-sa-search-account-form-minor-creditors-state.constant';
import { IFinesSaSearchAccountState } from '../interfaces/fines-sa-search-account-state.interface';

export const FINES_SA_SEARCH_ACCOUNT_STATE: IFinesSaSearchAccountState = {
  fsa_search_account_business_unit_ids: null,
  fsa_search_account_number: null,
  fsa_search_account_reference_case_number: null,
  fsa_search_account_individual_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE,
  fsa_search_account_companies_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_COMPANIES_STATE,
  fsa_search_account_minor_creditors_search_criteria: FINES_SA_SEARCH_ACCOUNT_FORM_MINOR_CREDITORS_STATE,
  fsa_search_account_major_creditor_search_criteria: null,
  fsa_search_account_active_accounts_only: true,
};
