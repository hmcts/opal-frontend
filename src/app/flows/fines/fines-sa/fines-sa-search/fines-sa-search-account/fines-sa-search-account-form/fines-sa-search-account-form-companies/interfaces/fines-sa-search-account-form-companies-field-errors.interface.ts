import { IAbstractFormBaseFieldError } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSaSearchAccountFieldErrors } from '../../../interfaces/fines-sa-search-account-field-errors.interface';

export interface IFinesSaSearchAccountFormCompaniesFieldErrors extends Partial<IFinesSaSearchAccountFieldErrors> {
  fsa_search_account_companies_company_name: IAbstractFormBaseFieldError;
  fsa_search_account_companies_company_name_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_companies_include_aliases: IAbstractFormBaseFieldError;
  fsa_search_account_companies_address_line_1: IAbstractFormBaseFieldError;
  fsa_search_account_companies_post_code: IAbstractFormBaseFieldError;
}
