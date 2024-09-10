import { IAbstractFormBaseFieldError, IAbstractFormBaseFieldErrors } from '@interfaces/components/abstract';

export interface IFinesMacCompanyDetailsFieldErrors extends IAbstractFormBaseFieldErrors {
  company_name: IAbstractFormBaseFieldError;
  alias_organisation_name_0: IAbstractFormBaseFieldError;
  alias_organisation_name_1: IAbstractFormBaseFieldError;
  alias_organisation_name_2: IAbstractFormBaseFieldError;
  alias_organisation_name_3: IAbstractFormBaseFieldError;
  alias_organisation_name_4: IAbstractFormBaseFieldError;
}
