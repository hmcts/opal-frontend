import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO = {
  fieldName: 'address_line_2',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};