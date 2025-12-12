import {
  IOpalFinesAmendPaymentTermsPayload,
  IOpalFinesAmendPaymentTermsResponse,
} from '../interfaces/opal-fines-amend-payment-terms.interface';

/**
 * Mock payload for amending payment terms - Pay in full scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_PAY_IN_FULL_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    jail_days: 30,
    suspended_committal_date: null,
    reason_for_extension: 'Payment plan adjustment',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'B' },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: null,
    instalment_amount: null,
  },
  payment_card_requested: null,
  generate_payment_terms_change_letter: null,
};

/**
 * Mock payload for amending payment terms - Lump sum scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_LUMP_SUM_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    jail_days: null,
    suspended_committal_date: null,
    reason_for_extension: 'Updated to lump sum payment',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'A' },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: 500.0,
    instalment_amount: null,
  },
  payment_card_requested: false,
  generate_payment_terms_change_letter: true,
};

/**
 * Mock payload for amending payment terms - Instalment scenario
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_INSTALMENT_PAYLOAD_MOCK: IOpalFinesAmendPaymentTermsPayload = {
  payment_terms: {
    jail_days: null,
    suspended_committal_date: null,
    reason_for_extension: 'Set up instalment plan',
    extension: true,
    payment_terms_type: { payment_terms_type_code: 'C' },
    effective_date: '2025-02-01',
    instalment_period: { instalment_period_code: 'M' },
    lump_sum_amount: null,
    instalment_amount: 50.0,
  },
  payment_card_requested: true,
  generate_payment_terms_change_letter: false,
};

/**
 * Mock response for successful payment terms amendment
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_SUCCESS_RESPONSE_MOCK: IOpalFinesAmendPaymentTermsResponse = {
  defendant_account_id: 123456,
  message: 'Payment terms updated successfully',
};

/**
 * Mock response for payment terms amendment - minimal response
 */
export const OPAL_FINES_AMEND_PAYMENT_TERMS_MINIMAL_RESPONSE_MOCK: IOpalFinesAmendPaymentTermsResponse = {
  defendant_account_id: 123456,
};
