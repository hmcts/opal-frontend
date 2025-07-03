import { IFinesSaSearchAccountFormCompanyState } from '../fines-sa-search-account-form/fines-sa-search-account-form-companies/interfaces/fines-sa-search-account-form-company-state.interface';
import { IFinesSaSearchAccountFormIndividualsState } from '../fines-sa-search-account-form/fines-sa-search-account-form-individuals/interfaces/fines-sa-search-account-form-individuals-state.interface';
import { IFinesSaSearchAccountFormMajorCreditorState } from '../fines-sa-search-account-form/fines-sa-search-account-form-major-creditors/interfaces/fines-sa-search-account-form-major-creditor-state.interface';
import { IFinesSaSearchAccountFormMinorCreditorState } from '../fines-sa-search-account-form/fines-sa-search-account-form-minor-creditors/interfaces/fines-sa-search-account-form-minor-creditor-state.interface';

export interface IFinesSaSearchAccountState {
  fsa_search_account_business_unit_ids: number[] | null;
  fsa_search_account_number: string | null;
  fsa_search_account_reference_case_number: string | null;
  fsa_search_account_individual_search_criteria: IFinesSaSearchAccountFormIndividualsState | null;
  fsa_search_account_companies_search_criteria: IFinesSaSearchAccountFormCompanyState | null;
  fsa_search_account_minor_creditor_search_criteria: IFinesSaSearchAccountFormMinorCreditorState | null;
  fsa_search_account_major_creditor_search_criteria: IFinesSaSearchAccountFormMajorCreditorState | null;
  fsa_search_account_active_accounts_only: boolean | null;
}
