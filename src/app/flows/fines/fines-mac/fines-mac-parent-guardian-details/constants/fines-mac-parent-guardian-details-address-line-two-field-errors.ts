import { FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants';
import { IFinesMacParentGuardianDetailsAddressLineTwoFieldErrors } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_TWO_FIELD_ERRORS: IFinesMacParentGuardianDetailsAddressLineTwoFieldErrors =
  {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS,
    AddressLine2: {
      ...FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS.AddressLine2,
      maxlength: {
        message: 'The address line 2 must be 25 characters or fewer',
        priority: 2,
      },
    },
  };
