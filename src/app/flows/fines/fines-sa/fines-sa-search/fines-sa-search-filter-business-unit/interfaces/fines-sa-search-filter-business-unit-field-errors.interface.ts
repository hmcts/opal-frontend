import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesSaSearchFilterBusinessUnitFieldErrors extends IAbstractFormBaseFieldErrors {
  fsa_search_account_business_unit_codes: IAbstractFormBaseFieldError;
}
