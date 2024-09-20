import { DateTime } from 'luxon';
import { IFinesMacPaymentTermsState } from '../interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK: IFinesMacPaymentTermsState = {
  has_collection_order: false,
  collection_order_date: DateTime.now().toFormat('dd/MM/yyyy'),
  payment_terms: 'payInFull',
  pay_by_date: DateTime.now().toFormat('dd/MM/yyyy'),
  request_payment_card: true,
  has_days_in_default: false,
  add_enforcement_action: false,
  make_collection_order_today: null,
};
