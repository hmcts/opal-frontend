import { IFinesMacPaymentTermsFieldErrors } from '../interfaces/fines-mac-payment-terms-field-errors.interface';

export const FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS: IFinesMacPaymentTermsFieldErrors = {
  fm_payment_terms_collection_order_made: {
    required: {
      message: `Select whether there was a collection order`,
      priority: 1,
    },
  },
  fm_payment_terms_collection_order_date: {
    required: {
      message: `Enter date collection order made`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid calendar date`,
      priority: 3,
    },
    invalidFutureDate: {
      message: `Date cannot be in the future`,
      priority: 4,
    },
    dateNotBefore: {
      message: `Date cannot be before the date of sentence`,
      priority: 5,
    },
  },
  fm_payment_terms_payment_terms: {
    required: {
      message: `Select payment terms`,
      priority: 1,
    },
  },
  fm_payment_terms_pay_by_date: {
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
  fm_payment_terms_lump_sum_amount: {
    required: {
      message: `Enter lump sum`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid lump sum amount`,
      priority: 2,
    },
  },
  fm_payment_terms_instalment_amount: {
    required: {
      message: `Enter instalment amount`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid instalment amount`,
      priority: 2,
    },
  },
  fm_payment_instalment_period: {
    required: {
      message: `Select frequency of payment`,
      priority: 1,
    },
  },
  fm_payment_terms_start_date: {
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
  fm_payment_terms_suspended_committal_date: {
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
  fm_payment_terms_default_days_in_jail: {
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
  fm_payment_terms_reason_account_is_on_noenf: {
    required: {
      message: `Enter a reason`,
      priority: 1,
    },
    maxlength: {
      message: `Reason must be less than 28 characters`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Reason must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes`,
      priority: 3,
    },
  },
  fm_payment_terms_enforcement_action: {
    required: {
      message: `Select reason for enforcement action`,
      priority: 1,
    },
  },
  fm_payment_terms_earliest_release_date: {
    invalidDateFormat: {
      message: `Date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid calendar date`,
      priority: 3,
    },
    invalidPastDate: {
      message: `Date must be in the future`,
      priority: 4,
    },
  },
  fm_payment_terms_prison_and_prison_number: {
    maxlength: {
      message: `Prison and prison number must be less than 28 characters`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `Prison and prison number must only include letters a to z, numbers 0-9 and special characters such as hyphens, spaces and apostrophes`,
      priority: 3,
    },
  },
};
