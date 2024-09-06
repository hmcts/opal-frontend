import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE = {
  controlName: 'address_line_3',
  initialValue: null,
  validators: [optionalMaxLengthValidator(16), specialCharactersValidator()],
};
