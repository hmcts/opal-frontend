import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE = {
  vehicle_make: new FormControl(null, [optionalMaxLengthValidator(30)]),
};
