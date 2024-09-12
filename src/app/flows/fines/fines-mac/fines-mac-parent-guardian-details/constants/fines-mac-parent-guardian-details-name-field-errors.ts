import { IFinesMacParentGuardianDetailsNameFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-name-field-errors.interface';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_ERRORS: IFinesMacParentGuardianDetailsNameFieldErrors = {
  forenames: {
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
  surname: {
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
