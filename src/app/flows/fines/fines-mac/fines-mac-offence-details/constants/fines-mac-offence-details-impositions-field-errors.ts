import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS = (index: number): IAbstractFormBaseFieldErrors => {
  const indexSuffix = `_${index}`;

  return {
    [`fm_offence_details_result_code${indexSuffix}`]: {
      required: {
        message: 'Enter an imposition code',
        priority: 1,
      },
    },
    [`fm_offence_details_amount_imposed${indexSuffix}`]: {
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
    [`fm_offence_details_amount_paid${indexSuffix}`]: {
      invalidAmountValue: {
        message: 'Enter an amount using numbers only',
        priority: 2,
      },
      invalidAmount: {
        message: 'Amount too long. Enter an amount that is less than 18 numbers before the decimal and 2 or less after',
        priority: 3,
      },
    },
    [`fm_offence_details_creditor${indexSuffix}`]: {},
  };
};
