import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccMinorCreditorAddAmendConvertFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_minor_creditor_creditor_type: IAbstractFormBaseFieldError;
  facc_minor_creditor_title: IAbstractFormBaseFieldError;
  facc_minor_creditor_forenames: IAbstractFormBaseFieldError;
  facc_minor_creditor_surname: IAbstractFormBaseFieldError;
  facc_minor_creditor_company_name: IAbstractFormBaseFieldError;
  facc_minor_creditor_address_line_1: IAbstractFormBaseFieldError;
  facc_minor_creditor_address_line_2: IAbstractFormBaseFieldError;
  facc_minor_creditor_address_line_3: IAbstractFormBaseFieldError;
  facc_minor_creditor_address_line_4: IAbstractFormBaseFieldError;
  facc_minor_creditor_address_line_5: IAbstractFormBaseFieldError;
  facc_minor_creditor_post_code: IAbstractFormBaseFieldError;
  facc_minor_creditor_bank_account_name: IAbstractFormBaseFieldError;
  facc_minor_creditor_bank_sort_code: IAbstractFormBaseFieldError;
  facc_minor_creditor_bank_account_number: IAbstractFormBaseFieldError;
  facc_minor_creditor_bank_account_reference: IAbstractFormBaseFieldError;
}
