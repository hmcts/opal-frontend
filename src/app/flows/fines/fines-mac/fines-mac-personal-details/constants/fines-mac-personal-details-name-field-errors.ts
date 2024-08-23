import { IFinesMacPersonalDetailsNameFieldErrors } from '../interfaces';

export const FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_ERRORS: IFinesMacPersonalDetailsNameFieldErrors = {
  Forenames: {
    required: {
      message: `Enter defendant's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  Surname: {
    required: {
      message: `Enter defendant's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The defendant's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The defendant's last name must only contain alphabetical text`,
      priority: 2,
    },
  },
};
