import { IAbstractFormBaseFieldError } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export interface IFinesMacPaymentTermsFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_payment_terms_collection_order_made: IAbstractFormBaseFieldError;
  fm_payment_terms_collection_order_date: IAbstractFormBaseFieldError;
  fm_payment_terms_payment_terms: IAbstractFormBaseFieldError;
  fm_payment_terms_pay_by_date: IAbstractFormBaseFieldError;
  fm_payment_terms_lump_sum: IAbstractFormBaseFieldError;
  fm_payment_terms_instalment: IAbstractFormBaseFieldError;
  fm_payment_terms_frequency: IAbstractFormBaseFieldError;
  fm_payment_terms_start_date: IAbstractFormBaseFieldError;
  fm_payment_terms_suspended_committal_date: IAbstractFormBaseFieldError;
  fm_payment_terms_days_in_default: IAbstractFormBaseFieldError;
  fm_payment_terms_enforcement_action: IAbstractFormBaseFieldError;
  fm_payment_terms_earliest_release_date: IAbstractFormBaseFieldError;
  fm_payment_terms_prison_and_prison_number: IAbstractFormBaseFieldError;
  fm_payment_terms_reason_account_is_on_noenf: IAbstractFormBaseFieldError;
}
