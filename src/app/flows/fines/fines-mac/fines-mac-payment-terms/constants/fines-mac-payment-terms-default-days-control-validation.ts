import { IFinesMacPaymentTermsDefaultDaysControlValidation } from '../interfaces/';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT_DATE as PT_CONTROLS_DAYS_IN_DEFAULT_DATE } from './controls/fines-mac-payment-terms-controls-days-in-default-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT as PT_CONTROLS_DAYS_IN_DEFAULT } from './controls/fines-mac-payment-terms-controls-days-in-default.constant';

export const FINES_MAC_PAYMENT_TERMS_DEFAULT_DATES_CONTROL_VALIDATION: IFinesMacPaymentTermsDefaultDaysControlValidation[] =
  [PT_CONTROLS_DAYS_IN_DEFAULT_DATE, PT_CONTROLS_DAYS_IN_DEFAULT];
