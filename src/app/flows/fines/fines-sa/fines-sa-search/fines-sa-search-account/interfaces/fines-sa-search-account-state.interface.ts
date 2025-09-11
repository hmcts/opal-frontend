import { IFinesSaSearchAccountFormCompaniesState } from '../fines-sa-search-account-form/fines-sa-search-account-form-companies/interfaces/fines-sa-search-account-form-companies-state.interface';
import { IFinesSaSearchAccountFormIndividualsState } from '../fines-sa-search-account-form/fines-sa-search-account-form-individuals/interfaces/fines-sa-search-account-form-individuals-state.interface';
import { IFinesSaSearchAccountFormMajorCreditorState } from '../fines-sa-search-account-form/fines-sa-search-account-form-major-creditors/interfaces/fines-sa-search-account-form-major-creditor-state.interface';
import { IFinesSaSearchAccountFormMinorCreditorsState } from '../fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditors-state.interface';

export interface IFinesSaSearchAccountState {
  fsa_search_account_business_unit_ids: number[] | null;
  fsa_search_account_number: string | null;
  fsa_search_account_reference_case_number: string | null;
  fsa_search_account_individuals_search_criteria: IFinesSaSearchAccountFormIndividualsState | null;
  fsa_search_account_companies_search_criteria: IFinesSaSearchAccountFormCompaniesState | null;
  fsa_search_account_minor_creditors_search_criteria: IFinesSaSearchAccountFormMinorCreditorsState | null;
  fsa_search_account_major_creditor_search_criteria: IFinesSaSearchAccountFormMajorCreditorState | null;
  fsa_search_account_active_accounts_only: boolean | null;
}
