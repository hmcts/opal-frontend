import { FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants/fines-mac-address-block-line-two-field-errors';
import { IFinesMacParentGuardianDetailsAddressLineTwoFieldErrors } from '../interfaces/fines-mac-parent-guardian-details-address-line-two-field-errors.interface';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS: IFinesMacParentGuardianDetailsAddressLineTwoFieldErrors =
  {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS,
    address_line_2: {
      ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS['address_line_2'],
      maxlength: {
        message: 'The address line 2 must be 25 characters or fewer',
        priority: 2,
      },
    },
  };
