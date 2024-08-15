import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS: IFinesMacParentGuardianDetailsFieldErrors = {
  FullName: {
    required: {
      message: 'You must enter a full name',
      priority: 1,
    },
    maxlength: {
      message: 'The full name must be 30 characters or fewer',
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The full name must only contain alphabetical text`,
      priority: 2,
    },
  },
};
