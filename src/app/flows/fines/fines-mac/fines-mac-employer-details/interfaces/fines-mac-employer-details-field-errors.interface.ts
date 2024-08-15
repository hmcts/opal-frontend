import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacEmployerDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  EmployerCompanyName: IAbstractFormBaseFieldError;
  EmployerReference: IAbstractFormBaseFieldError;
  EmployerEmailAddress: IAbstractFormBaseFieldError;
  EmployerTelephoneNumber: IAbstractFormBaseFieldError;
  EmployerAddressLine1: IAbstractFormBaseFieldError;
  EmployerAddressLine2: IAbstractFormBaseFieldError;
  EmployerAddressLine3: IAbstractFormBaseFieldError;
  EmployerAddressLine4: IAbstractFormBaseFieldError;
  EmployerAddressLine5: IAbstractFormBaseFieldError;
  EmployerPostcode: IAbstractFormBaseFieldError;
}
