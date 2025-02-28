import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacPersonalDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_personal_details_title: IAbstractFormBaseFieldError;
  fm_personal_details_forenames: IAbstractFormBaseFieldError;
  fm_personal_details_surname: IAbstractFormBaseFieldError;
  fm_personal_details_alias_forenames_0: IAbstractFormBaseFieldError;
  fm_personal_details_alias_surname_0: IAbstractFormBaseFieldError;
  fm_personal_details_alias_forenames_1: IAbstractFormBaseFieldError;
  fm_personal_details_alias_surname_1: IAbstractFormBaseFieldError;
  fm_personal_details_alias_forenames_2: IAbstractFormBaseFieldError;
  fm_personal_details_alias_surname_2: IAbstractFormBaseFieldError;
  fm_personal_details_alias_forenames_3: IAbstractFormBaseFieldError;
  fm_personal_details_alias_surname_3: IAbstractFormBaseFieldError;
  fm_personal_details_alias_forenames_4: IAbstractFormBaseFieldError;
  fm_personal_details_alias_surname_4: IAbstractFormBaseFieldError;
  fm_personal_details_dob: IAbstractFormBaseFieldError;
  fm_personal_details_national_insurance_number: IAbstractFormBaseFieldError;
  fm_personal_details_address_line_1: IAbstractFormBaseFieldError;
  fm_personal_details_address_line_2: IAbstractFormBaseFieldError;
  fm_personal_details_address_line_3: IAbstractFormBaseFieldError;
  fm_personal_details_post_code: IAbstractFormBaseFieldError;
  fm_personal_details_vehicle_make: IAbstractFormBaseFieldError;
  fm_personal_details_vehicle_registration_mark: IAbstractFormBaseFieldError;
}
