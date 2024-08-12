import { IFinesMacCreateAccountFieldErrors } from '../interfaces';

export const FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS: IFinesMacCreateAccountFieldErrors = {
  AccountType: {
    required: {
      message: 'Select an account type',
      priority: 1,
    },
  },
  FineDefendantType: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  FixedPenaltyDefendantType: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  BusinessUnit: {
    required: {
      message: 'Enter a business unit',
      priority: 1,
    },
  },
};
