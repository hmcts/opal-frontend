import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacCompanyDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  company_name: IAbstractFormBaseFieldError;
  alias_organisation_name_0: IAbstractFormBaseFieldError;
  alias_organisation_name_1: IAbstractFormBaseFieldError;
  alias_organisation_name_2: IAbstractFormBaseFieldError;
  alias_organisation_name_3: IAbstractFormBaseFieldError;
  alias_organisation_name_4: IAbstractFormBaseFieldError;
}
