import { FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT as F_M_PAYMENT_TERMS_INSTALMENT } from './controls/fines-mac-payment-terms-controls-instalment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY as F_M_PAYMENT_TERMS_FREQUENCY } from './controls/fines-mac-payment-terms-controls-frequency.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_START_DATE as F_M_PAYMENT_TERMS_START_DATE } from './controls/fines-mac-payment-terms-controls-start-date.constant';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  F_M_PAYMENT_TERMS_INSTALMENT,
  F_M_PAYMENT_TERMS_FREQUENCY,
  F_M_PAYMENT_TERMS_START_DATE,
];
