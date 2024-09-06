import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO = {
  controlName: 'address_line_2',
  initialValue: null,
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
