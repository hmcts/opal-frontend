import { Validators } from '@angular/forms';
import { alphabeticalTextValidator } from '@validators';

export const FINES_MAC_CONTROLS_FORENAMES = {
  fieldName: 'forenames',
  validators: [Validators.required, Validators.maxLength(20), alphabeticalTextValidator()],
};
