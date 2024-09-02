import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacNameFieldErrors extends IAbstractFormBaseFieldErrors {
  forenames: IAbstractFormBaseFieldError;
  surname: IAbstractFormBaseFieldError;
}
