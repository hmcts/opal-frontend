import { IFinesMacDeleteAccountConfirmationFieldErrors } from '../interfaces/fines-mac-delete-account-confirmation-field-errors.interface';

export const FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FIELD_ERRORS: IFinesMacDeleteAccountConfirmationFieldErrors = {
  fm_delete_account_confirmation_reason: {
    required: {
      message: 'Enter reason for deletion',
      priority: 1,
    },
    maxlength: {
      message: 'Reason must be 250 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: 'Reason must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 3,
    },
  },
};
