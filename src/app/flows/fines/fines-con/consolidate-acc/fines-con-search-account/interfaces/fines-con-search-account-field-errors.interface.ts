import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

/**
 * Field error mapping for consolidated search account form.
 * Defines error messages for each form control and form-level validators.
 */
export interface IFinesConSearchAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fcon_search_account_number: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_last_name: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_first_names: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_date_of_birth: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_national_insurance_number: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_address_line_1: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_post_code: IAbstractFormBaseFieldError;
  fcon_search_account_companies_name: IAbstractFormBaseFieldError;
  fcon_search_account_companies_reference_number: IAbstractFormBaseFieldError;
}
