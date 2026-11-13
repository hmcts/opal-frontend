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
  payerType: {
    required: { message: 'Select payer type', priority: 1 },
  },
  firstNames: {
    pattern: { message: 'First names must only include letters a to z, hyphens, spaces and apostrophes', priority: 1 },
    maxlength: { message: 'First names must be 20 characters or fewer', priority: 2 },
  },
  lastName: {
    required: { message: 'Enter last name', priority: 1 },
    pattern: { message: 'Last name must only include letters a to z, hyphens, spaces and apostrophes', priority: 2 },
    maxlength: { message: 'Last name must be 30 characters or fewer', priority: 3 },
  },
  companyName: {
    required: { message: 'Enter company name', priority: 1 },
    pattern: {
      message: 'Company name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
    maxlength: { message: 'Company name must be 50 characters or fewer', priority: 3 },
  },
};
