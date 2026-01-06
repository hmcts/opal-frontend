import { IOpalFinesAmendPaymentTermsPayload } from '../interfaces/opal-fines-amend-payment-terms-payload.interface';

/**
 * Mock payload for amending payment terms - Instalment scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_INSTALMENT_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    reason_for_extension: 'Set up instalment plan',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'C', payment_terms_type_display_name: null },
    effective_date: '2025-02-01',
    instalment_period: { instalment_period_code: 'M', instalment_period_display_name: null },
    lump_sum_amount: null,
    instalment_amount: 50.0,
  },
  request_payment_card: true,
  generate_payment_terms_change_letter: false,
};
