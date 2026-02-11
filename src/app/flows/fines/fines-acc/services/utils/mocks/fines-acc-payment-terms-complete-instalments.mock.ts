import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

/**
 * Complete instalments scenario with all fields populated
 */
export const PAYMENT_TERMS_COMPLETE_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: 10,
    date_days_in_default_imposed: '2024-12-01',
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    effective_date: '2025-02-01',
    instalment_period: {
      instalment_period_code: 'F',
      instalment_period_display_name: 'Fortnightly',
    },
    lump_sum_amount: null,
    instalment_amount: 75.0,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: '2024-11-15',
  last_enforcement: 'ENF456',
};
