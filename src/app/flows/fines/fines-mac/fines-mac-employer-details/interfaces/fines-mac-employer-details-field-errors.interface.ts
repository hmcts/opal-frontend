import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacEmployerDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_employer_details_employer_company_name: IAbstractFormBaseFieldError;
  fm_employer_details_employer_reference: IAbstractFormBaseFieldError;
  fm_employer_details_employer_email_address: IAbstractFormBaseFieldError;
  fm_employer_details_employer_telephone_number: IAbstractFormBaseFieldError;
  fm_employer_details_employer_address_line_1: IAbstractFormBaseFieldError;
  fm_employer_details_employer_address_line_2: IAbstractFormBaseFieldError;
  fm_employer_details_employer_address_line_3: IAbstractFormBaseFieldError;
  fm_employer_details_employer_address_line_4: IAbstractFormBaseFieldError;
  fm_employer_details_employer_address_line_5: IAbstractFormBaseFieldError;
  fm_employer_details_employer_post_code: IAbstractFormBaseFieldError;
}
