import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';
import { FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-one-field-errors';
import { FINES_MAC_CONTROLS_ADDRESS_LINE_ONE as F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE } from '../../constants/controls/fines-mac-controls-address-line-one';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE.controlName]: {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS[F_M_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE.controlName],
    maxlength: {
      message: 'The address line 1 must be 25 characters or fewer',
      priority: 2,
    },
  },
};
