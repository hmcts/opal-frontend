import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacContactDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_contact_details_email_address_1: IAbstractFormBaseFieldError;
  fm_contact_details_email_address_2: IAbstractFormBaseFieldError;
  fm_contact_details_telephone_number_mobile: IAbstractFormBaseFieldError;
  fm_contact_details_telephone_number_home: IAbstractFormBaseFieldError;
  fm_contact_details_telephone_number_business: IAbstractFormBaseFieldError;
}
