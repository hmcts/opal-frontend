import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-payment-term-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT as PT_CONTROLS_INSTALMENT } from './controls/fines-mac-payment-terms-controls-instalment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY as PT_CONTROLS_FREQUENCY } from './controls/fines-mac-payment-terms-controls-frequency.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_START_DATE as PT_CONTROLS_START_DATE } from './controls/fines-mac-payment-terms-controls-start-date.constant';

export const FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[] =
  [PT_CONTROLS_INSTALMENT, PT_CONTROLS_FREQUENCY, PT_CONTROLS_START_DATE];
