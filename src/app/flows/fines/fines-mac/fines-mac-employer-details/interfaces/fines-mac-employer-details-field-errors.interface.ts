import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacEmployerDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  employer_company_name: IAbstractFormBaseFieldError;
  employer_reference: IAbstractFormBaseFieldError;
  employer_email_address: IAbstractFormBaseFieldError;
  employer_telephone_number: IAbstractFormBaseFieldError;
  employer_address_line_1: IAbstractFormBaseFieldError;
  employer_address_line_2: IAbstractFormBaseFieldError;
  employer_address_line_3: IAbstractFormBaseFieldError;
  employer_address_line_4: IAbstractFormBaseFieldError;
  employer_address_line_5: IAbstractFormBaseFieldError;
  employer_postcode: IAbstractFormBaseFieldError;
}
