import { IFinesMacDeleteAccountConfirmationFieldErrors } from '../interfaces/fines-mac-delete-account-confirmation-field-errors.interface';

export const FINES_MAC_DELETE_ACCOUNT_CONFIRMATION_FIELD_ERRORS: IFinesMacDeleteAccountConfirmationFieldErrors = {
  fm_delete_account_confirmation_reason: {
    required: {
      message: 'Enter reason for deletion',
      priority: 1,
    },
    alphanumericTextPattern: {
      message:
        'Reason must only include letters a to z, numbers 0-9 and certain special characters (commas, full stops, hyphens, spaces and apostrophes)',
      priority: 2,
    },
  },
};
