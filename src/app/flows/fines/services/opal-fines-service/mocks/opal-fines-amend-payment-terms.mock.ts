import { IOpalFinesAmendPaymentTermsPayload } from '../interfaces/opal-fines-amend-payment-terms.interface';

/**
 * Mock payload for amending payment terms - Pay in full scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_PAY_IN_FULL_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
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

/**
 * Mock payload for amending payment terms - Lump sum scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_LUMP_SUM_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    reason_for_extension: 'Updated to lump sum payment',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'A', payment_terms_type_display_name: null },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: 500.0,
    instalment_amount: null,
  },
  request_payment_card: false,
  generate_payment_terms_change_letter: true,
};

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
