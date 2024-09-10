import { IFinesMacAddressBlockLineThreeFieldErrors } from '../interfaces';

export const FINES_MAC_ADDRESS_BLOCK_LINE_THREE_FIELD_ERRORS: IFinesMacAddressBlockLineThreeFieldErrors = {
  address_line_3: {
    maxlength: {
      message: `The address line 3 must be 16 characters or fewer`,
      priority: 1,
    },
    specialCharactersPattern: {
      message: 'The address line 3 must not contain special characters',
      priority: 2,
    },
  },
};
