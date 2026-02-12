import { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';

/**
 * Field-specific error messages for the Individuals search form.
 * These errors override the base errors for this tab.
 */
export interface IFinesConSearchAccountFormIndividualsFieldErrors {
  fcon_search_account_individuals_last_name: IAbstractFormControlErrorMessage;
  fcon_search_account_individuals_first_names: IAbstractFormControlErrorMessage;
  fcon_search_account_individuals_date_of_birth: IAbstractFormControlErrorMessage;
}
