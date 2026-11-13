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
  addressLine1: {
    pattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: { message: 'Address line 1 must be 30 characters or fewer', priority: 2 },
  },
  addressLine2: {
    pattern: {
      message: 'Address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: { message: 'Address line 2 must be 30 characters or fewer', priority: 2 },
  },
  addressLine3: {
    pattern: {
      message: 'Address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: { message: 'Address line 3 must be 30 characters or fewer', priority: 2 },
  },
  postcode: {
    pattern: {
      message: 'Postcode must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 1,
    },
    maxlength: { message: 'Postcode must be 8 characters or fewer', priority: 2 },
  },
};
