import { FormControl, Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_ONE = {
  address_line_1: new FormControl(null, [Validators.required, Validators.maxLength(30), specialCharactersValidator()]),
};
