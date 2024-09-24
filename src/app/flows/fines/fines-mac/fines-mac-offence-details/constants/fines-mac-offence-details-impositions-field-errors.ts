import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_RESULT_CODE as F_M_O_D_C_RESULT_CODE } from './controls/fines-mac-offence-details-result-code.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_IMPOSED as F_M_O_D_C_AMOUNT_IMPOSED } from './controls/fines-mac-offence-details-amount-imposed.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_AMOUNT_PAID as F_M_O_D_C_AMOUNT_PAID } from './controls/fines-mac-offence-details-amount-paid.constant';
import { FINES_MAC_OFFENCE_DETAILS_CONTROLS_CREDITOR as F_M_O_D_C_CREDITOR } from './controls/fines-mac-offence-details-creditor.constant';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS = (index: number): IAbstractFormBaseFieldErrors => {
  const indexSuffix = `_${index}`;

  return {
    [`${F_M_O_D_C_RESULT_CODE.controlName}${indexSuffix}`]: {
      required: {
        message: 'Enter an imposition code',
        priority: 1,
      },
      valueNotInArray: {
        message: 'Offence not found',
        priority: 2,
      },
    },
    [`${F_M_O_D_C_AMOUNT_IMPOSED.controlName}${indexSuffix}`]: {
      required: {
        message: 'Enter an amount',
        priority: 1,
      },
      invalidAmountValue: {
        message: 'Enter an amount using numbers only',
        priority: 2,
      },
      invalidAmount: {
        message: 'Amount too long. Enter an amount that is less than 18 numbers before the decimal and 2 or less after',
        priority: 3,
      },
    },
    [`${F_M_O_D_C_AMOUNT_PAID.controlName}${indexSuffix}`]: {
      required: {
        message: 'Enter an amount',
        priority: 1,
      },
      invalidAmountValue: {
        message: 'Enter an amount using numbers only',
        priority: 2,
      },
      invalidAmount: {
        message: 'Amount too long. Enter an amount that is less than 18 numbers before the decimal and 2 or less after',
        priority: 3,
      },
    },
    [`${F_M_O_D_C_CREDITOR.controlName}${indexSuffix}`]: {},
  };
};
