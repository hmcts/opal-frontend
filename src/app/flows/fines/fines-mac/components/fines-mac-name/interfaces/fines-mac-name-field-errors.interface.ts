import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacNameFieldErrors extends IAbstractFormBaseFieldErrors {
  forenames: IAbstractFormBaseFieldError;
  surname: IAbstractFormBaseFieldError;
}
