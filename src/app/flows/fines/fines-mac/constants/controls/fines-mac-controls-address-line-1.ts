import { FormControl, Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_1 = {
  address_line_1: new FormControl(null, [Validators.required, Validators.maxLength(30), specialCharactersValidator()]),
};
