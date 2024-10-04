import { DateTime } from 'luxon';
import { IFinesMacPaymentTermsState } from '../interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_collection_order_made: false,
  fm_payment_terms_collection_order_date: DateTime.now().toFormat('dd/MM/yyyy'),
  fm_payment_terms_payment_terms: 'payInFull',
  fm_payment_terms_pay_by_date: DateTime.now().toFormat('dd/MM/yyyy'),
  fm_payment_terms_request_payment_card: true,
  fm_payment_terms_has_days_in_default: false,
  fm_payment_terms_add_enforcement_action: false,
  fm_payment_terms_make_collection_order_today: null,
};
