import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

export const MOCK_PAYMENT_TERMS_DATA: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  version: '1.0',
  payment_terms: {
    days_in_default: null,
    date_days_in_default_imposed: null,
    extension: false,
    reason_for_extension: null,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    effective_date: '2025-01-15',
    instalment_period: {
      instalment_period_code: 'M',
      instalment_period_display_name: 'Monthly',
    },
    lump_sum_amount: 0.0,
    instalment_amount: 50.0,
    posted_details: {
      posted_date: '2025-01-01',
      posted_by: 'TEST001',
      posted_by_name: 'Test User',
    },
  },
  payment_card_last_requested: null,
  last_enforcement: 'ENF123',
};
