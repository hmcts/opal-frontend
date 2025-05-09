import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MAC_OFFENCE_DETAILS_IMPOSITIONS_FIELD_ERRORS = (index: number): IAbstractFormBaseFieldErrors => {
  const indexSuffix = `_${index}`;

  return {
    [`fm_offence_details_result_id${indexSuffix}`]: {
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
        message: 'Enter an amount that is no more than 18 numbers before the decimal and 2 or less after',
        priority: 3,
      },
    },
    [`fm_offence_details_amount_paid${indexSuffix}`]: {
      invalidAmountValue: {
        message: 'Enter a valid amount',
        priority: 2,
      },
      invalidAmount: {
        message: 'Enter an amount that is no more than 18 numbers before the decimal and 2 or less after',
        priority: 3,
      },
    },
    [`fm_offence_details_creditor${indexSuffix}`]: {
      required: {
        message: 'Select whether major or minor creditor',
        priority: 1,
      },
      minorCreditorMissing: {
        message: 'Add minor creditor details',
        priority: 2,
      },
    },
    [`fm_offence_details_major_creditor_id${indexSuffix}`]: {
      required: {
        message: 'Enter a major creditor name or code',
        priority: 1,
      },
    },
  };
};
