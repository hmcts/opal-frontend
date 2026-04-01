import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

/**
 * Field error mapping for search account form.
 * Defines error messages for common fields and nested defendant-type-specific search criteria.
 */
export interface IFinesConSearchAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fcon_search_account_number: IAbstractFormBaseFieldError;
  fcon_search_account_national_insurance_number: IAbstractFormBaseFieldError;
  fcon_search_account_individuals_search_criteria: IAbstractFormBaseFieldError;
}
