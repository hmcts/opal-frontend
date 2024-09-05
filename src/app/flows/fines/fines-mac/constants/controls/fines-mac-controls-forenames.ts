import { FormControl, Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_CONTROLS_FORENAMES = {
  forenames: new FormControl(null, [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()]),
};
