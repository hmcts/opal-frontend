import { FormControl, Validators } from '@angular/forms';
import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';

export const FINES_MAC_CONTROLS_POSTCODE = {
  postcode: new FormControl(null, [optionalMaxLengthValidator(8)]),
};
