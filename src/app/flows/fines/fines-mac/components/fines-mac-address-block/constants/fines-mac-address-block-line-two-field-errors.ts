import { IFinesMacAddressBlockLineTwoFieldErrors } from '../interfaces';

export const FINES_MAC_ADDRESS_BLOCK_LINE_TWO_FIELD_ERRORS: IFinesMacAddressBlockLineTwoFieldErrors = {
  AddressLine2: {
    maxlength: {
      message: 'The address line 2 must be 30 characters or fewer',
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 2 must not contain special characters',
      priority: 2,
    },
  },
};
