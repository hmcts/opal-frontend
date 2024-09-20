import { FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION as PT_CONTROLS_INSTALMENT_CONTROLS } from './fines-mac-payment-terms-instalments-only-control-validation';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_LUMP_SUM as PT_CONTROLS_LUMP_SUM } from './controls/fines-mac-payment-terms-controls-lump-sum.constant';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION: IAbstractFormArrayControlValidation[] = [
  PT_CONTROLS_LUMP_SUM,
  ...PT_CONTROLS_INSTALMENT_CONTROLS,
];
