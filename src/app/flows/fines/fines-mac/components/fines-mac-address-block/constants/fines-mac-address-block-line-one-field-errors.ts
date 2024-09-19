import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE } from '../../../constants/controls/fines-mac-controls-address-line-one';

export const FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS = {
  [FINES_MAC_CONTROLS_ADDRESS_LINE_ONE.controlName]: {
    required: {
      message: 'Enter address line 1, typically the building and street',
      priority: 1,
    },
    maxlength: {
      message: 'The address line 1 must be 30 characters or fewer',
      priority: 2,
    },
    specialCharactersPattern: {
      message: 'The address line 1 must not contain special characters',
      priority: 3,
    },
  },
};
