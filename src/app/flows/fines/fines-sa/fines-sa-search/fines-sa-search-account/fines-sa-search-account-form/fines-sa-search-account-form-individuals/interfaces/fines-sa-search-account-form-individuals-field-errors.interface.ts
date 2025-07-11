import { IAbstractFormBaseFieldError } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSaSearchAccountFieldErrors } from '../../../interfaces/fines-sa-search-account-field-errors.interface';

export interface IFinesSaSearchAccountFormIndividualsFieldErrors extends Partial<IFinesSaSearchAccountFieldErrors> {
  fsa_search_account_individuals_last_name: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_last_name_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_first_names: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_first_names_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_include_aliases: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_date_of_birth: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_national_insurance_number: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_address_line_1: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_post_code: IAbstractFormBaseFieldError;
}
