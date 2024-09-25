import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-two-field-errors';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_TWO as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO } from '../../constants/controls/fines-mac-controls-address-line-two';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO.controlName]: {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS[F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO.controlName],
    maxlength: {
      message: 'The address line 2 must be 25 characters or fewer',
      priority: 2,
    },
  },
};
