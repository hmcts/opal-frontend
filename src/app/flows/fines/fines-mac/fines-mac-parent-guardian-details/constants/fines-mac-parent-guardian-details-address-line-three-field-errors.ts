import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-three-field-errors';
import { FINES_MAC_PARENT_GUARDIAN_DETAILS_CONTROLS_ADDRESS_LINE_THREE as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE } from '../constants/controls/fines-mac-parent-guardian-details-controls-address-line-three';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE.controlName]: {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS[F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE.controlName],
    maxlength: {
      message: `The address line 3 must be 13 characters or fewer`,
      priority: 1,
    },
  },
};
