import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesConSearchAccountFormCompaniesFieldErrors extends IAbstractFormBaseFieldErrors {
  fcon_search_account_companies_company_name: IAbstractFormBaseFieldError;
  fcon_search_account_companies_company_name_exact_match: IAbstractFormBaseFieldError;
  fcon_search_account_companies_include_aliases: IAbstractFormBaseFieldError;
  fcon_search_account_companies_address_line_1: IAbstractFormBaseFieldError;
  fcon_search_account_companies_post_code: IAbstractFormBaseFieldError;
}
