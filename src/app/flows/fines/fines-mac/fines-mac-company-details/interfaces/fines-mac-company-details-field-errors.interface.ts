import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCompanyDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_company_details_company_name: IAbstractFormBaseFieldError;
  fm_company_details_alias_company_name_0: IAbstractFormBaseFieldError;
  fm_company_details_alias_company_name_1: IAbstractFormBaseFieldError;
  fm_company_details_alias_company_name_2: IAbstractFormBaseFieldError;
  fm_company_details_alias_company_name_3: IAbstractFormBaseFieldError;
  fm_company_details_alias_company_name_4: IAbstractFormBaseFieldError;
  fm_company_details_address_line_1: IAbstractFormBaseFieldError;
  fm_company_details_address_line_2: IAbstractFormBaseFieldError;
  fm_company_details_address_line_3: IAbstractFormBaseFieldError;
  fm_company_details_postcode: IAbstractFormBaseFieldError;
}
