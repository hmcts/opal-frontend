import { DateTime } from 'luxon';
import { IFinesMacPaymentTermsState } from '../interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK: IFinesMacPaymentTermsState = {
  fm_payment_terms_collection_order_made: false,
  fm_payment_terms_collection_order_date: DateTime.now().toFormat('dd/MM/yyyy'),
  fm_payment_terms_payment_terms: 'payInFull',
  fm_payment_terms_pay_by_date: DateTime.now().toFormat('dd/MM/yyyy'),
  fm_payment_terms_payment_card_request: true,
  fm_payment_terms_has_days_in_default: false,
  fm_payment_terms_add_enforcement_action: false,
  fm_payment_terms_collection_order_made_today: null,
  fm_payment_terms_default_days_in_jail: null,
  fm_payment_terms_enforcement_action: null,
  fm_payment_terms_earliest_release_date: null,
  fm_payment_terms_hold_enforcement_on_account: null,
  fm_payment_terms_instalment_amount: null,
  fm_payment_terms_instalment_period: null,
  fm_payment_terms_lump_sum_amount: null,
  fm_payment_terms_prison_and_prison_number: null,
  fm_payment_terms_reason_account_is_on_noenf: null,
  fm_payment_terms_suspended_committal_date: null,
  fm_payment_terms_start_date: null,
};
