import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacNameFieldErrors extends IAbstractFormBaseFieldErrors {
  Forenames: IAbstractFormBaseFieldError;
  Surname: IAbstractFormBaseFieldError;
}
