import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_MCI_CREATE_TILL_COURT_FEE_PAYMENT_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  paymentReceivedFrom: {
    required: { message: 'Select who the payment was received from', priority: 1 },
  },
  paymentMethod: {
    required: { message: 'Select a method of payment', priority: 1 },
  },
  paymentSource: {
    required: { message: 'Select a source', priority: 1 },
  },
  paymentReference: {
    pattern: {
      message: 'Payment reference must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: { message: 'Payment reference must be 50 characters or fewer', priority: 2 },
  },
};
