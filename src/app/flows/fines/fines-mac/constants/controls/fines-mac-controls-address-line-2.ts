import { FormControl, Validators } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_2 = {
  address_line_2: new FormControl(null, [optionalMaxLengthValidator(30), specialCharactersValidator()]),
};
