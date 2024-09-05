import { IFinesMacPaymentTermsState } from '../interfaces';

export const FINES_MAC_PAYMENT_TERMS_STATE_MOCK: IFinesMacPaymentTermsState = {
  paymentTerms: 'Pay in full',
  payByDate: '01/01/2024',
  lumpSum: null,
  instalment: null,
  frequency: null,
  startDate: null,
  requestPaymentCard: true,
  hasDaysInDefault: true,
  daysInDefaultDate: '01/01/2024',
  daysInDefault: 100,
  addEnforcementAction: true,
};
