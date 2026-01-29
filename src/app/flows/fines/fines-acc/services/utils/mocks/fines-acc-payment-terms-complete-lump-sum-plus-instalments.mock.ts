import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

/**
 * Complete lump sum plus instalments scenario
 */
export const PAYMENT_TERMS_COMPLETE_LUMP_SUM_PLUS_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest =
  {
    version: '1.0',
    payment_terms: {
      days_in_default: null,
      date_days_in_default_imposed: null,
      extension: false,
      reason_for_extension: null,
      payment_terms_type: {
        payment_terms_type_code: 'B',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '2025-03-01',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 200.0,
      instalment_amount: 50.0,
      posted_details: {
        posted_date: '2025-01-01',
        posted_by: 'TEST001',
        posted_by_name: 'Test User',
      },
    },
    payment_card_last_requested: null,
    last_enforcement: null,
  };
