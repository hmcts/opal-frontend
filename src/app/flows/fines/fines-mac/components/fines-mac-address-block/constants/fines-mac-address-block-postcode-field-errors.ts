import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_CONTROLS_POSTCODE } from '../../../constants/controls/fines-mac-controls-postcode';
export const FINES_MAC_ADDRESS_BLOCK_POSTCODE_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [FINES_MAC_CONTROLS_POSTCODE.controlName]: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
};
