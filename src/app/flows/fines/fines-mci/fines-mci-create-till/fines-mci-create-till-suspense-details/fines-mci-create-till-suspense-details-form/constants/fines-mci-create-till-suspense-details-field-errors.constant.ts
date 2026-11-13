import { IFinesMciCreateTillSuspenseDetailsFieldErrors } from '../interfaces/fines-mci-create-till-suspense-details-field-errors.interface';

export const FINES_MCI_CREATE_TILL_SUSPENSE_DETAILS_FIELD_ERRORS: IFinesMciCreateTillSuspenseDetailsFieldErrors = {
  amount: {
    required: { message: 'Enter an amount', priority: 1 },
    invalidAmountValue: { message: 'Enter a valid amount', priority: 2 },
    invalidAmount: {
      message: 'Enter an amount with no more than 18 digits before the decimal and 2 or fewer after.',
      priority: 3,
    },
  },
  payerType: { required: { message: 'Select who payment was received from', priority: 1 } },
  methodOfPayment: { required: { message: 'Select a method of payment', priority: 1 } },
  paymentReferencePostalOrder: {
    maxlength: { message: 'Payment reference (Postal order) must be 50 characters or fewer', priority: 1 },
    pattern: {
      message:
        'Payment reference (Postal order) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  paymentReferenceCheque: {
    maxlength: { message: 'Payment reference (Cheque) must be 50 characters or fewer', priority: 1 },
    pattern: {
      message: 'Payment reference (Cheque) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  paymentReferenceCreditTransfer: {
    maxlength: { message: 'Payment reference (Credit transfer) must be 50 characters or fewer', priority: 1 },
    pattern: {
      message:
        'Payment reference (Credit transfer) must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
  source: { required: { message: 'Select a source', priority: 1 } },
  reason: { required: { message: 'Select a reason for the suspense', priority: 1 } },
  relevantDetails: {
    maxlength: { message: 'Add relevant details must be 50 characters or fewer', priority: 1 },
    pattern: {
      message: 'Add Relevant Details must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
};
