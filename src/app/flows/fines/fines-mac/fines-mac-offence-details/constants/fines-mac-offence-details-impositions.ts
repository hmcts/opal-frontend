import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE } from './controls/fines-mac-offence-details-result-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED } from './controls/fines-mac-offence-details-amount-imposed.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID } from './controls/fines-mac-offence-details-amount-paid.constant';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS: IAbstractFormArrayControlValidation[] = [
  FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE,
  FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED,
  FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID,
];
