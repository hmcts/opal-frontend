import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_CONTROLS_ADDRESS_LINE_THREE = {
  fieldName: 'address_line_3',
  validators: [optionalMaxLengthValidator(13), specialCharactersValidator()],
};
