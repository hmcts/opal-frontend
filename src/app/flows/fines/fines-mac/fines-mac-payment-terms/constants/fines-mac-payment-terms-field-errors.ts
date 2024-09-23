import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAYMENT_TERMS as PT_CONTROL_PAYMENT_TERMS } from '../constants/controls/fines-mac-payment-terms-controls-payment-terms.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PAY_BY_DATE as PT_CONTROL_PAY_BY_DATE } from '../constants/controls/fines-mac-payment-terms-controls-pay-by-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_LUMP_SUM as PT_CONTROL_LUMP_SUM } from '../constants/controls/fines-mac-payment-terms-controls-lump-sum.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_INSTALMENT as PT_CONTROL_INSTALMENT } from '../constants/controls/fines-mac-payment-terms-controls-instalment.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_FREQUENCY as PT_CONTROL_FREQUENCY } from '../constants/controls/fines-mac-payment-terms-controls-frequency.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_START_DATE as PT_CONTROL_START_DATE } from '../constants/controls/fines-mac-payment-terms-controls-start-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT as PT_CONTROL_DAYS_IN_DEFAULT } from '../constants/controls/fines-mac-payment-terms-controls-days-in-default.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_DAYS_IN_DEFAULT_DATE as PT_CONTROL_DAYS_IN_DEFAULT_DATE } from '../constants/controls/fines-mac-payment-terms-controls-days-in-default-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HAS_COLLECTION_ORDER as PT_CONTROL_HAS_COLLECTION_ORDER } from '../constants/controls/fines-mac-payment-terms-controls-has-collection-order.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_COLLECTION_ORDER_DATE as PT_CONTROL_COLLECTION_ORDER_DATE } from '../constants/controls/fines-mac-payment-terms-controls-collection-order-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF as PT_CONTROL_REASON_ACCOUNT_IS_ON_NOENF } from './controls/fines-mac-payment-terms-controls-hold-enforcement-reason.constant';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_PAYMENT_TERMS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [PT_CONTROL_HAS_COLLECTION_ORDER.controlName]: {
    required: {
      message: `Select whether there was a collection order`,
      priority: 1,
    },
  },
  [PT_CONTROL_COLLECTION_ORDER_DATE.controlName]: {
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
    invalidYear: {
      message: `Date cannot be 2003 or earlier`,
      priority: 5,
    },
  },
  [PT_CONTROL_PAYMENT_TERMS.controlName]: {
    required: {
      message: `Select payment terms`,
      priority: 1,
    },
  },
  [PT_CONTROL_PAY_BY_DATE.controlName]: {
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
  [PT_CONTROL_LUMP_SUM.controlName]: {
    required: {
      message: `Enter lump sum`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid lump sum amount`,
      priority: 2,
    },
  },
  [PT_CONTROL_INSTALMENT.controlName]: {
    required: {
      message: `Enter instalment amount`,
      priority: 1,
    },
    invalidDecimal: {
      message: `Enter valid instalment amount`,
      priority: 2,
    },
  },
  [PT_CONTROL_FREQUENCY.controlName]: {
    required: {
      message: `Select frequency of payment`,
      priority: 1,
    },
  },
  [PT_CONTROL_START_DATE.controlName]: {
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
  [PT_CONTROL_DAYS_IN_DEFAULT_DATE.controlName]: {
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
  [PT_CONTROL_DAYS_IN_DEFAULT.controlName]: {
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
  [PT_CONTROL_REASON_ACCOUNT_IS_ON_NOENF.controlName]: {
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
};
