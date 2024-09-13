import { IFinesMacPaymentTermsFieldErrors } from '../interfaces/fines-mac-payment-terms-field-errors.inteface';

export const FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS: IFinesMacPaymentTermsFieldErrors = {
  payment_terms: {
    required: {
      message: `Select payment terms`,
      priority: 1,
    },
  },
  pay_by_date: {
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
  lump_sum: {
    required: {
      message: `Enter lump sum`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid lump sum amount`,
      priority: 2,
    },
  },
  instalment: {
    required: {
      message: `Enter instalment amount`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid instalment amount`,
      priority: 2,
    },
  },
  frequency: {
    required: {
      message: `Select frequency of payment`,
      priority: 1,
    },
  },
  start_date: {
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
  days_in_default_date: {
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
  days_in_default: {
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
  reason_account_is_on_noenf: {
    required: {
      message: `Enter a reason`,
      priority: 1,
    },
    maxlength: {
      message: `Reason must be less than 28 characters`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Reason must only contain alphabetical text`,
      priority: 3,
    },
  },
};
