import { FormControl, Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_CONTROLS_SURNAME = {
  surname: new FormControl(null, [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()]),
};
