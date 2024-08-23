import { FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS } from '../../components/fines-mac-address-block/constants';
import { IFinesMacParentGuardianDetailsAddressLineThreeFieldErrors } from '../interfaces';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_ADDRESS_LINE_THREE_FIELD_ERRORS: IFinesMacParentGuardianDetailsAddressLineThreeFieldErrors =
  {
    ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS,
    AddressLine3: {
      ...FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS.AddressLine3,
      maxlength: {
        message: `The address line 3 must be 13 characters or fewer`,
        priority: 1,
      },
    },
  };
