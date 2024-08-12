import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacContactDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  EmailAddress1: IAbstractFormBaseFieldError;
  EmailAddress2: IAbstractFormBaseFieldError;
  TelephoneNumberMobile: IAbstractFormBaseFieldError;
  TelephoneNumberHome: IAbstractFormBaseFieldError;
  TelephoneNumberBusiness: IAbstractFormBaseFieldError;
}
