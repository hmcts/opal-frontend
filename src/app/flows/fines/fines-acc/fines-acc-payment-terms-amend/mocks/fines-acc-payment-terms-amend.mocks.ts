import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { IOpalFinesAmendPaymentTermsPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-amend-payment-terms-payload.interface';

export const MOCK_FORM_DATA: IFinesAccPaymentTermsAmendForm = {
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

export const MOCK_PAYLOAD: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    days_in_default: 30,
    date_days_in_default_imposed: null,
    reason_for_extension: 'Payment plan adjustment',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'B', payment_terms_type_display_name: null },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: null,
    instalment_amount: null,
  },
  request_payment_card: null,
  generate_payment_terms_change_letter: null,
};
