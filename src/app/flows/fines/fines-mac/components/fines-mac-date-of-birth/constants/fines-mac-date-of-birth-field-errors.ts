import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_CONTROLS_DOB } from '../../../constants/controls/fines-mac-controls-dob';

export const FINES_MAC_DATE_OF_BIRTH_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [FINES_MAC_CONTROLS_DOB.controlName]: {
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
