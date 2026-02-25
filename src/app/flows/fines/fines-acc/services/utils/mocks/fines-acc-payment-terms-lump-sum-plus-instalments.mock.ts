import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { FINES_ACC_BASE_PAYMENT_TERMS_DATA } from './fines-acc-base-payment-terms-data.mock';

/**
 * Payment terms data with type B (By Date) with lump sum - maps to Lump Sum Plus Instalments
 */
export const PAYMENT_TERMS_LUMP_SUM_PLUS_INSTALMENTS_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...FINES_ACC_BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...FINES_ACC_BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'B',
      payment_terms_type_display_name: 'By date',
    },
    instalment_period: {
      instalment_period_code: 'W',
      instalment_period_display_name: 'Weekly',
    },
    lump_sum_amount: 100.0,
    instalment_amount: 25.0,
  },
};
