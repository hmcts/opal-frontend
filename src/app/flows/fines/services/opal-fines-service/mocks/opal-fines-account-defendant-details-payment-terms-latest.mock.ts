import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PAYMENT_TERMS_LATEST_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest =
  {
    version: null,
    payment_terms: {
      days_in_default: null,
      date_days_in_default_imposed: null,
      extension: false,
      reason_for_extension: null,
      payment_terms_type: {
        payment_terms_type_code: 'B',
        payment_terms_type_display_name: 'By date',
      },
      effective_date: '2025-10-23',
      instalment_period: {
        instalment_period_code: 'M',
        instalment_period_display_name: 'Monthly',
      },
      lump_sum_amount: 0.0,
      instalment_amount: 20.0,
      posted_details: {
        posted_date: '2025-10-21',
        posted_by: 'L080JG',
        posted_by_name: 'opal-test-2',
      },
    },
    payment_card_last_requested: '2025-10-11',
    last_enforcement: 'REM',
  };
