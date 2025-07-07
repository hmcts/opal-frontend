import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesSaSearchAccountFieldErrors extends IAbstractFormBaseFieldErrors {
  fsa_search_account_business_unit_ids: IAbstractFormBaseFieldError;
  fsa_search_account_number: IAbstractFormBaseFieldError;
  fsa_search_account_reference_case_number: IAbstractFormBaseFieldError;
  fsa_search_account_active_accounts_only: IAbstractFormBaseFieldError;
}
