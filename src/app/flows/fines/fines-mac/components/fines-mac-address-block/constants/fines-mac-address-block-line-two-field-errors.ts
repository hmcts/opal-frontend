import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO } from '../../../constants/controls/fines-mac-controls-address-line-two';

export const FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [FINES_MAC_CONTROLS_ADDRESS_LINE_TWO.controlName]: {
    maxlength: {
      message: 'The address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
};
