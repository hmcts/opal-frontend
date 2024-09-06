import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacContactDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  email_address_1: IAbstractFormBaseFieldError;
  email_address_2: IAbstractFormBaseFieldError;
  telephone_number_mobile: IAbstractFormBaseFieldError;
  telephone_number_home: IAbstractFormBaseFieldError;
  telephone_number_business: IAbstractFormBaseFieldError;
}
