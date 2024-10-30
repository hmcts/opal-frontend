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
        message: 'Enter amount imposed',
        priority: 1,
      },
      invalidAmountValue: {
        message: 'Enter a valid amount',
        priority: 2,
      },
      invalidAmount: {
        message: 'Enter a valid amount',
        priority: 3,
      },
    },
    [`fm_offence_details_amount_paid${indexSuffix}`]: {
      invalidAmountValue: {
        message: 'Enter a valid amount',
        priority: 2,
      },
      invalidAmount: {
        message: 'Enter a valid amount',
        priority: 3,
      },
    },
    [`fm_offence_details_creditor${indexSuffix}`]: {
      required: {
        message: 'Select whether major or minor creditor',
        priority: 1,
      },
    },
    [`fm_offence_details_major_creditor${indexSuffix}`]: {
      required: {
        message: 'Enter a major creditor name or code',
        priority: 1,
      },
    },
  };
};
