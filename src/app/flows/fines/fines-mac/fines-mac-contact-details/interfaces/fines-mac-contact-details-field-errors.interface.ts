import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacContactDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  email_address_1: IAbstractFormBaseFieldError;
  email_address_2: IAbstractFormBaseFieldError;
  telephone_number_mobile: IAbstractFormBaseFieldError;
  telephone_number_home: IAbstractFormBaseFieldError;
  telephone_number_business: IAbstractFormBaseFieldError;
}
