import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_CREATE_TILL_COURT_FEE_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  courtFeeId: {
    required: { message: 'Enter court fee code', priority: 2 },
    invalidCourtFee: { message: 'Enter a valid court fee', priority: 1 },
  },
  amountPaid: {
    required: { message: 'Enter an amount', priority: 1 },
    pattern: { message: 'Enter numbers only', priority: 2 },
  },
  numberOfItems: {
    required: { message: 'Enter number of items', priority: 1 },
    pattern: { message: 'Enter numbers only', priority: 2 },
    min: { message: 'Enter a number of items greater than 0', priority: 3 },
  },
};
