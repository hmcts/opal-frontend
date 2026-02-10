import { IOpalFinesAccountDefendantDetailsPaymentTermsLatest } from '../../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-details-payment-terms-latest.interface';
import { FINES_ACC_BASE_PAYMENT_TERMS_DATA } from './fines-acc-base-payment-terms-data.mock';

/**
 * Payment terms data with type I (Instalments Only)
 */
export const PAYMENT_TERMS_INSTALMENTS_ONLY_MOCK: IOpalFinesAccountDefendantDetailsPaymentTermsLatest = {
  ...FINES_ACC_BASE_PAYMENT_TERMS_DATA,
  payment_terms: {
    ...FINES_ACC_BASE_PAYMENT_TERMS_DATA.payment_terms,
    payment_terms_type: {
      payment_terms_type_code: 'I',
      payment_terms_type_display_name: 'Instalments',
    },
    instalment_period: {
      instalment_period_code: 'M',
      instalment_period_display_name: 'Monthly',
    },
    instalment_amount: 50.0,
  },
};
