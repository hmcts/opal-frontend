import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_3 = {
  address_line_3: new FormControl(null, [optionalMaxLengthValidator(16), specialCharactersValidator()]),
};
