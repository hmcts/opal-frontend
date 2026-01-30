import { IOpalFinesAmendPaymentTermsPayload } from '../interfaces/opal-fines-amend-payment-terms-payload.interface';

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
    posted_details: {
      posted_by: null,
      posted_date: '2025-02-02',
      posted_by_name: null,
    },
  },
  request_payment_card: false,
  generate_payment_terms_change_letter: true,
};
