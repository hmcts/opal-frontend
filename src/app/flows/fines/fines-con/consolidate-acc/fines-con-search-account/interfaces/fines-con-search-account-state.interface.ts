import { IFinesConSearchAccountFormIndividualsState } from '../fines-con-search-account-form/fines-con-search-account-form-individuals/interfaces/fines-con-search-account-form-individuals-state.interface';
import { IFinesConSearchAccountFormCompaniesState } from '../fines-con-search-account-form/fines-con-search-account-form-companies/interfaces/fines-con-search-account-form-companies-state.interface';

/**
 * Interface for the consolidated search account state.
 * Contains common search fields and nested defendant-type-specific search criteria.
 */
export interface IFinesConSearchAccountState {
  fcon_search_account_number: string | null;
  fcon_search_account_national_insurance_number: string | null;
  fcon_search_account_individuals_search_criteria: IFinesConSearchAccountFormIndividualsState | null;
  fcon_search_account_companies_search_criteria: IFinesConSearchAccountFormCompaniesState | null;
}
