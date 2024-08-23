import { IFinesMacAddressBlockPostcodeFieldErrors } from '../interfaces';

export const FINES_MAC_ADDRESS_BLOCK_POSTCODE_FIELD_ERRORS: IFinesMacAddressBlockPostcodeFieldErrors = {
  Postcode: {
    maxlength: {
      message: `The postcode must be 8 characters or fewer`,
      priority: 1,
    },
  },
};
