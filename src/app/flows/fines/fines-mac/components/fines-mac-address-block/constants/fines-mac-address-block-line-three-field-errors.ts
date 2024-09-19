import { FINES_MAC_CONTROLS_ADDRESS_LINE_THREE } from '../../../constants/controls/fines-mac-controls-address-line-three';

export const FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS = {
  [FINES_MAC_CONTROLS_ADDRESS_LINE_THREE.controlName]: {
    maxlength: {
      message: `The address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
};
