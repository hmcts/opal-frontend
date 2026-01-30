import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { FINES_ACC_BASE_PAYMENT_TERMS_DATA } from './fines-acc-base-payment-terms-data.mock';

/**
 * Payment terms data with type P (Pay in Full)
 */
export const PAYMENT_TERMS_PAY_IN_FULL_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...FINES_ACC_BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...FINES_ACC_BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'P',
      payment_terms_type_display_name: 'Paid',
    },
  },
};
