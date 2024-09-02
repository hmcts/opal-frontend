import { IFinesMacNameFieldErrors } from '../interfaces';

export const FINES_MAC_NAME_FIELD_ERRORS: IFinesMacNameFieldErrors = {
  Forenames: {
    required: {
      message: `Enter parent or guardian's first name(s)`,
      priority: 1,
    },
    maxlength: {
      message: `The parent or guardian's first name(s) must be 20 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The parent or guardian's first name(s) must only contain alphabetical text`,
      priority: 2,
    },
  },
  Surname: {
    required: {
      message: `Enter parent or guardian's last name`,
      priority: 1,
    },
    maxlength: {
      message: `The parent or guardian's last name must be 30 characters or fewer`,
      priority: 2,
    },
    alphabeticalTextPattern: {
      message: `The parent or guardian's last name must only contain alphabetical text`,
      priority: 2,
    },
  },
};