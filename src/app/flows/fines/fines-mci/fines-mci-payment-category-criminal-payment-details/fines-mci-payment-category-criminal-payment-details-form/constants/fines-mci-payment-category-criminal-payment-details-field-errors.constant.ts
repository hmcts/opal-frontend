import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_PAYMENT_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  amount: {
    required: { message: 'Enter amount', priority: 1 },
    invalidAmountValue: { message: 'Enter only numbers and decimals', priority: 2 },
    pattern: { message: 'Enter only numbers and decimals', priority: 2 },
    invalidAmount: {
      message: 'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
      priority: 3,
    },
    negativeValue: { message: 'Amount cannot be a negative value', priority: 4 },
    zeroValue: { message: 'Amount cannot be zero', priority: 4 },
  },
  payerType: { required: { message: 'Select who the payment was received from', priority: 1 } },
  methodOfPayment: { required: { message: 'Select a method of payment', priority: 1 } },
  paymentReferencePostalOrder: {
    maxlength: { message: 'Payment reference must be 50 characters or fewer', priority: 1 },
    pattern: {
      message: 'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  paymentReferenceCheque: {
    maxlength: { message: 'Payment reference must be 50 characters or fewer', priority: 1 },
    pattern: {
      message: 'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  paymentReferenceCreditTransfer: {
    maxlength: { message: 'Payment reference must be 50 characters or fewer', priority: 1 },
    pattern: {
      message: 'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  source: { required: { message: 'Select a source', priority: 1 } },
  thirdPartyName: {
    required: { message: 'Enter name', priority: 1 },
    maxlength: { message: 'Name must be 50 characters or fewer', priority: 2 },
    pattern: {
      message: 'Name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
};
