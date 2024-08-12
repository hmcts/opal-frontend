import { IAbstractFieldError, IAbstractFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacEmployerDetailsFieldErrors extends IAbstractFieldErrors {
  EmployerCompanyName: IAbstractFieldError;
  EmployerReference: IAbstractFieldError;
  EmployerEmailAddress: IAbstractFieldError;
  EmployerTelephoneNumber: IAbstractFieldError;
  EmployerAddressLine1: IAbstractFieldError;
  EmployerAddressLine2: IAbstractFieldError;
  EmployerAddressLine3: IAbstractFieldError;
  EmployerAddressLine4: IAbstractFieldError;
  EmployerAddressLine5: IAbstractFieldError;
  EmployerPostcode: IAbstractFieldError;
}
