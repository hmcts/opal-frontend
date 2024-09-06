import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_POSTCODE = {
  postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
};
