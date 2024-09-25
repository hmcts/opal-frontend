import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_CONTROLS_FORENAMES as F_M_PARENT_GUARDIAN_DETAILS_FORENAMES } from '../../constants/controls/fines-mac-controls-forenames';
import { FINES_MAC_CONTROLS_SURNAME as F_M_PARENT_GUARDIAN_DETAILS_SURNAME } from '../../constants/controls/fines-mac-controls-surname';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_NAME_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_PARENT_GUARDIAN_DETAILS_FORENAMES.controlName]: {
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
  [F_M_PARENT_GUARDIAN_DETAILS_SURNAME.controlName]: {
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
