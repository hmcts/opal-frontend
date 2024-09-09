import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE = {
  fieldName: 'address_line_3',
  validators: [optionalMaxLengthValidator(16), specialCharactersValidator()],
};