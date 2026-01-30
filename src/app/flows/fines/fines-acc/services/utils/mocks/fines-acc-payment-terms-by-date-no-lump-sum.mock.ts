import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { FINES_ACC_BASE_PAYMENT_TERMS_DATA } from './fines-acc-base-payment-terms-data.mock';

/**
 * Payment terms data with type B (By Date) without lump sum - maps to Pay in Full
 */
export const PAYMENT_TERMS_BY_DATE_NO_LUMP_SUM_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...FINES_ACC_BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...FINES_ACC_BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'B',
      payment_terms_type_display_name: 'By date',
    },
    lump_sum_amount: 0.0,
  },
};
