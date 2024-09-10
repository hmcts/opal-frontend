import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacPaymentTermsFieldErrors extends IAbstractFormBaseFieldErrors {
  days_in_default_date: IAbstractFormBaseFieldError;
  days_in_default: IAbstractFormBaseFieldError;
}
