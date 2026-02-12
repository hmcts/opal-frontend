import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

/**
 * Base payment terms data structure for testing
 */
export const FINES_ACC_BASE_PAYMENT_TERMS_DATA: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'P',
      payment_terms_type_display_name: 'Paid',
    },
    effective_date: '2025-01-15',
    instalment_period: null,
    lump_sum_amount: null,
    instalment_amount: null,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: null,
  last_enforcement: null,
};
