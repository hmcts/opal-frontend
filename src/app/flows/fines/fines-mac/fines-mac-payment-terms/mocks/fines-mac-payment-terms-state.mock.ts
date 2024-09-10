import { IFinesMacPaymentTermsState } from '../interfaces/fines-mac-payment-terms-state.interface';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK: IFinesMacPaymentTermsState = {
  payment_terms: 'Pay in full',
  hold_enforcement_on_account: true,
  has_days_in_default: true,
  days_in_default_date: '01/01/2024',
  days_in_default: 100,
};
