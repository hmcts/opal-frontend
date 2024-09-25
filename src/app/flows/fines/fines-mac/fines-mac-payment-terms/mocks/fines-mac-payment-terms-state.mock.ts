import { DateTime } from 'luxon';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_COLLECTION_ORDER as F_M_PAYMENT_TERMS_HAS_COLLECTION_ORDER } from '../constants/controls/fines-mac-payment-terms-controls-has-collection-order.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAYMENT_TERMS as F_M_PAYMENT_TERMS_PAYMENT_TERMS } from '../constants/controls/fines-mac-payment-terms-controls-payment-terms.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REQUEST_CARD_PAYMENT as F_M_PAYMENT_TERMS_REQUEST_CARD_PAYMENT } from '../constants/controls/fines-mac-payment-terms-controls-request-card-payment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_DAYS_IN_DEFAULT as F_M_PAYMENT_TERMS_HAS_DAYS_IN_DEFAULT } from '../constants/controls/fines-mac-payment-terms-controls-has-days-in-default.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_ADD_ENFORCEMENT_ACTION as F_M_PAYMENT_TERMS_ADD_ENFORCEMENT_ACTION } from '../constants/controls/fines-mac-payment-terms-controls-add-enforcement-action.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAY_BY_DATE as F_M_PAYMENT_TERMS_PAY_BY_DATE } from '../constants/controls/fines-mac-payment-terms-controls-pay-by-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_COLLECTION_ORDER_DATE as F_M_PAYMENT_TERMS_COLLECTION_ORDER_DATE } from '../constants/controls/fines-mac-payment-terms-controls-collection-order-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_MAKE_COLLECTION_ORDER_TODAY as F_M_PAYMENT_TERMS_MAKE_COLLECTION_ORDER_TODAY } from '../constants/controls/fines-mac-payment-terms-controls-make-collection-order-today.constant';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK = {
  [F_M_PAYMENT_TERMS_HAS_COLLECTION_ORDER.controlName]: false,
  [F_M_PAYMENT_TERMS_COLLECTION_ORDER_DATE.controlName]: DateTime.now().toFormat('dd/MM/yyyy'),
  [F_M_PAYMENT_TERMS_PAYMENT_TERMS.controlName]: 'payInFull',
  [F_M_PAYMENT_TERMS_PAY_BY_DATE.controlName]: DateTime.now().toFormat('dd/MM/yyyy'),
  [F_M_PAYMENT_TERMS_REQUEST_CARD_PAYMENT.controlName]: true,
  [F_M_PAYMENT_TERMS_HAS_DAYS_IN_DEFAULT.controlName]: false,
  [F_M_PAYMENT_TERMS_ADD_ENFORCEMENT_ACTION.controlName]: false,
  [F_M_PAYMENT_TERMS_MAKE_COLLECTION_ORDER_TODAY.controlName]: null,
};
