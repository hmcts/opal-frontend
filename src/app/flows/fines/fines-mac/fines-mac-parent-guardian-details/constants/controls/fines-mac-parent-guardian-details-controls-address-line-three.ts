import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_PARENT_GUARDIAN_DETAILS_CONTROLS_ADDRESS_LINE_THREE = {
  address_line_3: new FormControl(null, [optionalMaxLengthValidator(13), specialCharactersValidator()]),
};
