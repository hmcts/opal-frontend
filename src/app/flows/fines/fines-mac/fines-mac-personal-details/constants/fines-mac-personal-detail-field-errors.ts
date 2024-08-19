import { IFinesMacPersonalDetailsFieldErrors } from '../interfaces';

export const FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS: IFinesMacPersonalDetailsFieldErrors = {
  Title: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
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
