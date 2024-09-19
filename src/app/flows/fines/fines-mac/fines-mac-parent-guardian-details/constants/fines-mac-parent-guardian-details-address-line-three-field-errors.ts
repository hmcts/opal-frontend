import { FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-three-field-errors';
import { IFinesMacParentGuardianDetailsAddressLineThreeFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-address-line-three-field-errors.interface';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS = {
  ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS,
  address_line_3: {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS['address_line_3'],
    maxlength: {
      message: `The address line 3 must be 13 characters or fewer`,
      priority: 1,
    },
  },
};
