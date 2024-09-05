import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO = {
  address_line_2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
};
