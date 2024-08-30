import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacPaymentTermsFieldErrors extends IAbstractFormBaseFieldErrors {
  daysInDefaultDate: IAbstractFormBaseFieldError;
  daysInDefault: IAbstractFormBaseFieldError;
}
