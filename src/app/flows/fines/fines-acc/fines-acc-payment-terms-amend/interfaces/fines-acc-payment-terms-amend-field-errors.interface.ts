import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccPaymentTermsAmendFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_payment_terms_payment_terms: IAbstractFormBaseFieldError;
  facc_payment_terms_pay_by_date: IAbstractFormBaseFieldError;
  facc_payment_terms_lump_sum_amount: IAbstractFormBaseFieldError;
  facc_payment_terms_instalment_amount: IAbstractFormBaseFieldError;
  facc_payment_terms_instalment_period: IAbstractFormBaseFieldError;
  facc_payment_terms_start_date: IAbstractFormBaseFieldError;
  facc_payment_terms_suspended_committal_date: IAbstractFormBaseFieldError;
  facc_payment_terms_default_days_in_jail: IAbstractFormBaseFieldError;
  facc_payment_terms_reason_for_change: IAbstractFormBaseFieldError;
  facc_payment_terms_change_letter: IAbstractFormBaseFieldError;
}
