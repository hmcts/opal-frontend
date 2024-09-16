import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacPaymentTermsFieldErrors extends IAbstractFormBaseFieldErrors {
  days_in_default_date: IAbstractFormBaseFieldError;
  days_in_default: IAbstractFormBaseFieldError;
}
