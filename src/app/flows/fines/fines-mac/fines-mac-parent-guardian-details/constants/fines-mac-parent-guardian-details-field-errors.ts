import { IFinesMacParentGuardianDetailsFieldErrors } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_FIELD_ERRORS: IFinesMacParentGuardianDetailsFieldErrors = {
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
  VehicleMake: {
    maxlength: {
      message: `The make of car must be 30 characters or fewer`,
      priority: 1,
    },
  },
  VehicleRegistrationMark: {
    maxlength: {
      message: `The registration number must be 11 characters or fewer`,
      priority: 1,
    },
  },
};
