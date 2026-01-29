import { IFinesAccPaymentTermsAmendFieldErrors } from '../interfaces/fines-acc-payment-terms-amend-field-errors.interface';

export const FINES_ACC_PAYMENT_TERMS_AMEND_FIELD_ERRORS: IFinesAccPaymentTermsAmendFieldErrors = {
  facc_payment_terms_payment_terms: {
    required: {
      message: `Select payment terms`,
      priority: 1,
    },
  },
  facc_payment_terms_pay_by_date: {
    required: {
      message: `Enter pay by date`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid date`,
      priority: 3,
    },
    invalidPastDate: {
      message: `Date cannot be in the past`,
      priority: 4,
    },
  },
  facc_payment_terms_lump_sum_amount: {
    required: {
      message: `Enter lump sum amount`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter an amount with no more than 18 digits before the decimal and 2 or fewer after`,
      priority: 2,
    },
  },
  facc_payment_terms_instalment_amount: {
    required: {
      message: `Enter instalment amount`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter an amount with no more than 18 digits before the decimal and 2 or fewer after`,
      priority: 2,
    },
  },
  facc_payment_terms_instalment_period: {
    required: {
      message: `Select frequency of instalments`,
      priority: 1,
    },
  },
  facc_payment_terms_start_date: {
    required: {
      message: `Enter start date`,
      priority: 1,
    },
    invalidDateFormat: {
      message: `Date must be in the format DD/MM/YYYY`,
      priority: 2,
    },
    invalidDate: {
      message: `Enter a valid date`,
      priority: 3,
    },
    invalidPastDate: {
      message: `Date cannot be in the past`,
      priority: 4,
    },
  },
  facc_payment_terms_suspended_committal_date: {
    required: {
      message: `Enter date days in default were imposed`,
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
      message: `Date must not be in the future`,
      priority: 4,
    },
  },
  facc_payment_terms_default_days_in_jail: {
    required: {
      message: `Enter days in default`,
      priority: 1,
    },
    maxlength: {
      message: `Default days in jail must be 5 characters or fewer`,
      priority: 2,
    },
    numericalTextPattern: {
      message: `Default days in jail must only contain numbers`,
      priority: 3,
    },
  },
  facc_payment_terms_reason_for_change: {
    required: {
      message: `Enter reason for change`,
      priority: 1,
    },
    maxlength: {
      message: `Reason for change must be 250 characters or fewer`,
      priority: 2,
    },
    alphanumericWithHyphensSpacesApostrophesDotPattern: {
      message: `Reason for change must only include letters a to z, numbers 0-9 and certain special characters (hyphens, spaces, apostrophes)`,
      priority: 3,
    },
  },
  facc_payment_terms_payment_card_request: {
    payInFullRestriction: {
      message: `Cannot request a payment card when payment terms are 'Pay in full'`,
      priority: 1,
    },
  },
  facc_payment_terms_change_letter: {
    noChangesMade: {
      message: `Cannot generate payment terms change letter as no changes made`,
      priority: 1,
    },
  },
};
