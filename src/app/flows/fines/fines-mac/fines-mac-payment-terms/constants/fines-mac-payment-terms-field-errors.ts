import { IFinesMacPaymentTermsFieldErrors } from '../interfaces';

export const FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS: IFinesMacPaymentTermsFieldErrors = {
  payByDate: {
    required: {
      message: `Enter a pay by date`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Pay by date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid calendar date`,
      priority: 3,
    },
  },
  lumpSum: {
    required: {
      message: `Enter lump sum`,
      priority: 1,
    },
  },
  instalment: {
    required: {
      message: `Enter instalment amount`,
      priority: 1,
    },
  },
  frequency: {
    required: {
      message: `Select frequency of payment`,
      priority: 1,
    },
  },
  startDate: {
    required: {
      message: `Enter start date`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Start date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid calendar date`,
      priority: 3,
    },
  },
  daysInDefaultDate: {
    required: {
      message: `Enter date days in default were imposed`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Default date must be in the format DD/MM/YYYY`,
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
    maxlength: {
      message: `Days in default needs to be less than 5 digits`,
      priority: 3,
    },
  },
};
