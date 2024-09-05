import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE = {
  address_line_three: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
};
