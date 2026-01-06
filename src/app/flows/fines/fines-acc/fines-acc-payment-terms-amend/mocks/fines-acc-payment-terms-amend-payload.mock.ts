import { IOpalFinesAmendPaymentTermsPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-amend-payment-terms-payload.interface';

export const FINES_ACC_PAYMENT_TERMS_AMEND_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
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
