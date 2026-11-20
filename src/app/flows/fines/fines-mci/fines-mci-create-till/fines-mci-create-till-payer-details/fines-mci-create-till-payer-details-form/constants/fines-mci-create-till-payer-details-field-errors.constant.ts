import { IFinesMciCreateTillPayerDetailsFieldErrors } from '../interfaces/fines-mci-create-till-payer-details-field-errors.interface';

export const FINES_MCI_CREATE_TILL_PAYER_DETAILS_FIELD_ERRORS: IFinesMciCreateTillPayerDetailsFieldErrors = {
  payerType: { required: { message: 'Select payer type', priority: 1 } },
  firstNames: {
    maxlength: { message: 'First names must be 20 characters or fewer', priority: 1 },
    pattern: { message: 'First names must only include letters a to z, hyphens, spaces and apostrophes', priority: 2 },
  },
  lastName: {
    required: { message: 'Enter last name', priority: 1 },
    maxlength: { message: 'Last name must be 30 characters or fewer', priority: 2 },
    pattern: { message: 'Last name must only include letters a to z, hyphens, spaces and apostrophes', priority: 3 },
  },
  companyName: {
    required: { message: 'Enter company name', priority: 1 },
    maxlength: { message: 'Company name must be 50 characters or fewer', priority: 2 },
    pattern: {
      message: 'Company name must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
  addressLine1: {
    maxlength: { message: 'Address line 1 must be 30 characters or fewer', priority: 1 },
    pattern: {
      message: 'Address line 1 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  addressLine2: {
    maxlength: { message: 'Address line 2 must be 30 characters or fewer', priority: 1 },
    pattern: {
      message: 'Address line 2 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  addressLine3: {
    maxlength: { message: 'Address line 3 must be 30 characters or fewer', priority: 1 },
    pattern: {
      message: 'Address line 3 must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  postcode: {
    maxlength: { message: 'Post code must be 8 characters or fewer', priority: 1 },
    alphanumericTextPattern: { message: 'Post code must only include letters a to z, numbers and spaces', priority: 2 },
  },
};
