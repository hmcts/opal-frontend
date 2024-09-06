import { Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_ONE = {
  controlName: 'address_line_1',
  initialValue: null,
  validators: [Validators.required, Validators.maxLength(30), specialCharactersValidator()],
};
