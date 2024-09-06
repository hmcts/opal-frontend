import { IFinesMacDateOfBirthFieldErrors } from '../interfaces';

export const FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS: IFinesMacDateOfBirthFieldErrors = {
  dob: {
    invalidDateFormat: {
      message: `Enter date of birth in the format DD/MM/YYYY`,
      priority: 1,
    },
    invalidDate: {
      message: `Enter a valid date of birth`,
      priority: 2,
    },
    invalidDateOfBirth: {
      message: `Enter a valid date of birth in the past`,
      priority: 3,
    },
  },
};
