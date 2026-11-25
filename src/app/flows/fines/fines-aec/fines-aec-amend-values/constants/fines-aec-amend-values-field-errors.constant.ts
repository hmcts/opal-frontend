import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_AEC_AMEND_VALUES_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  minimum_balance: {
    required: { message: 'Enter a minimum enforcement value', priority: 1 },
    invalidAmountValue: {
      message: 'Enter a minimum enforcement value in numbers between 0 and 9999.99',
      priority: 2,
    },
    invalidAmount: {
      message: 'Enter a minimum enforcement value in numbers between 0 and 9999.99',
      priority: 3,
    },
    negativeValue: {
      message: 'Enter a minimum enforcement value in numbers between 0 and 9999.99',
      priority: 4,
    },
    minHigherThanHigh: { message: 'Minimum value cannot be higher than high value.', priority: 5 },
  },
  high_value: {
    invalidAmountValue: {
      message: 'Enter a high enforcement value in numbers between 0 and 9999999.99',
      priority: 1,
    },
    invalidAmount: {
      message: 'Enter a high enforcement value in numbers between 0 and 9999999.99',
      priority: 2,
    },
    negativeValue: {
      message: 'Enter a high enforcement value in numbers between 0 and 9999999.99',
      priority: 3,
    },
  },
};
