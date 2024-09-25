import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_PERSONAL_DETAILS_CONTROLS_TITLE as F_M_PERSONAL_DETAILS_TITLE } from '../constants/controls/fines-mac-personal-details-controls-title';
export const FINES_MAC_PERSONAL_DETAILS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_PERSONAL_DETAILS_TITLE.controlName]: {
    required: {
      message: 'Select a title',
      priority: 1,
    },
  },
};
