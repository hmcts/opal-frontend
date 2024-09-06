import { FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants';
import { IFinesMacParentGuardianDetailsAddressLineOneFieldErrors } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_ONE_FIELD_ERRORS: IFinesMacParentGuardianDetailsAddressLineOneFieldErrors =
  {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS,
    address_line_1: {
      ...FINES_MAC_ADDRESS_BLOCK_LINE_ONE_FIELD_ERRORS.address_line_1,
      maxlength: {
        message: 'The address line 1 must be 25 characters or fewer',
        priority: 2,
      },
    },
  };
