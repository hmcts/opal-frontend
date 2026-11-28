import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesSuspenseItemSearchFieldErrors extends IAbstractFormBaseFieldErrors {
  fsis_business_unit_id: IAbstractFormBaseFieldError;
  fsis_suspense_reference_number: IAbstractFormBaseFieldError;
}
