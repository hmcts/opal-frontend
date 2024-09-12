import { IFinesMacCreateAccountFieldErrors } from '../interfaces/fines-mac-create-account-field-errors.interface';

export const FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS: IFinesMacCreateAccountFieldErrors = {
  account_type: {
    required: {
      message: 'Select an account type',
      priority: 1,
    },
  },
  fine_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  fixed_penalty_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  business_unit: {
    required: {
      message: 'Enter a business unit',
      priority: 1,
    },
  },
};
