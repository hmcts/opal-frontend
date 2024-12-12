import { IFinesMacCreateAccountFieldErrors } from '../interfaces/fines-mac-create-account-field-errors.interface';

export const FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS: IFinesMacCreateAccountFieldErrors = {
  fm_create_account_account_type: {
    required: {
      message: 'Select an account type',
      priority: 1,
    },
  },
  fm_create_account_fine_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  fm_create_account_fixed_penalty_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  fm_create_account_business_unit_id: {
    required: {
      message: 'Enter a business unit',
      priority: 1,
    },
  },
};
