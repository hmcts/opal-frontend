import { IAbstractFormBaseFieldError } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesSaSearchAccountFieldErrors } from '../../../interfaces/fines-sa-search-account-field-errors.interface';

export interface IFinesSaSearchAccountFormMinorCreditorsFieldErrors extends Partial<IFinesSaSearchAccountFieldErrors> {
  fsa_search_account_minor_creditors_minor_creditor_type: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_last_name: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_last_name_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_first_names: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_first_names_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_company_name: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_company_name_exact_match: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_address_line_1: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_post_code: IAbstractFormBaseFieldError;
}
