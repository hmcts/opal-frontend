import { FormControl } from '@angular/forms';
import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK = {
  vehicle_registration_mark: new FormControl(null, [optionalMaxLengthValidator(11)]),
};
