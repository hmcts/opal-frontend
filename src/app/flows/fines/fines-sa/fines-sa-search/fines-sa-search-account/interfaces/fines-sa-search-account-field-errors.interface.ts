import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesSaSearchAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fsa_search_account_business_unit_ids: IAbstractFormBaseFieldError;
  fsa_search_account_number: IAbstractFormBaseFieldError;
  fsa_search_account_reference_case_number: IAbstractFormBaseFieldError;
  fsa_search_account_individuals_search_criteria: IAbstractFormBaseFieldError;
  fsa_search_account_companies_search_criteria: IAbstractFormBaseFieldError;
  fsa_search_account_minor_creditors_search_criteria: IAbstractFormBaseFieldError;
  fsa_search_account_major_creditor_search_criteria: IAbstractFormBaseFieldError;
  fsa_search_account_active_accounts_only: IAbstractFormBaseFieldError;
}
