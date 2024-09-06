import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_CONTROLS_SURNAME = {
  controlName: 'surname',
  initialValue: null,
  validators: [Validators.required, Validators.maxLength(30), alphabeticalTextValidator()],
};
