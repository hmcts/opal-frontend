import { IFinesMacPaymentTermsFieldErrors } from '../interfaces';

export const FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS: IFinesMacPaymentTermsFieldErrors = {
  daysInDefaultDate: {
    required: {
      message: `Enter date days in default were imposed`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Default date must be in the format dd/mm/yyyy`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid calendar date`,
      priority: 3,
    },
    invalidDateOfBirth: {
      message: `Date must not be in the future`,
      priority: 4,
    },
  },
  daysInDefault: {
    required: {
      message: `Enter days in default`,
      priority: 1,
    },
    numericalTextPattern: {
      message: `Enter number of days in default`,
      priority: 2,
    },
  },
};
