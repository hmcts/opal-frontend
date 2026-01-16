import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';

export const FINES_ACC_PAYMENT_TERMS_AMEND_FORM_MOCK: IFinesAccPaymentTermsAmendForm = {
  formData: {
    facc_payment_terms_payment_terms: 'payInFull',
    facc_payment_terms_pay_by_date: '2025-01-15',
    facc_payment_terms_lump_sum_amount: null,
    facc_payment_terms_instalment_amount: null,
    facc_payment_terms_instalment_period: null,
    facc_payment_terms_start_date: null,
    facc_payment_terms_payment_card_request: null,
    facc_payment_terms_prevent_payment_card: null,
    facc_payment_terms_has_days_in_default: null,
    facc_payment_terms_suspended_committal_date: null,
    facc_payment_terms_default_days_in_jail: 30,
    facc_payment_terms_reason_for_change: 'Payment plan adjustment',
    facc_payment_terms_change_letter: null,
  },
  nestedFlow: false,
};
