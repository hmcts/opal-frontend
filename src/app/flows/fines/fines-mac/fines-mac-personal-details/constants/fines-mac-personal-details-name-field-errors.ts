import { IFinesMacPersonalDetailsNameFieldErrors } from '../interfaces/fines-mac-personal-details-name-field-errors.interface';

export const FINES_MAC_PERSONAL_DETAILS_NAME_FIELD_ERRORS: IFinesMacPersonalDetailsNameFieldErrors = {
  forenames: {
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
  surname: {
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
