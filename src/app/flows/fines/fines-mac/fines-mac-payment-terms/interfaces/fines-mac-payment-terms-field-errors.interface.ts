import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacPaymentTermsFieldErrors extends IAbstractFormBaseFieldErrors {
  [key: string]: IAbstractFormBaseFieldError;
}
