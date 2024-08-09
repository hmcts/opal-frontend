import { IAbstractFieldError, IAbstractFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacContactDetailsFieldErrors extends IAbstractFieldErrors {
  EmailAddress1: IAbstractFieldError;
  EmailAddress2: IAbstractFieldError;
  TelephoneNumberMobile: IAbstractFieldError;
  TelephoneNumberHome: IAbstractFieldError;
  TelephoneNumberBusiness: IAbstractFieldError;
}
