import { IFinesConSearchAccountState } from '../interfaces/fines-con-search-account-state.interface';
import { FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE } from '../fines-con-search-account-form/fines-con-search-account-form-individuals/constants/fines-con-search-account-form-individuals-state.constant';
import { FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_STATE } from '../fines-con-search-account-form/fines-con-search-account-form-companies/constants/fines-con-search-account-form-companies-state.constant';

/**
 * Initial state for the search account form.
 * Contains common search fields and nested defendant-type-specific search criteria.
 * All fields are initialized to null unless otherwise specified.
 */
export const FINES_CON_SEARCH_ACCOUNT_STATE: IFinesConSearchAccountState = {
  fcon_search_account_number: null,
  fcon_search_account_national_insurance_number: null,
  fcon_search_account_individuals_search_criteria: FINES_CON_SEARCH_ACCOUNT_FORM_INDIVIDUALS_STATE,
  fcon_search_account_companies_search_criteria: FINES_CON_SEARCH_ACCOUNT_FORM_COMPANIES_STATE,
};
