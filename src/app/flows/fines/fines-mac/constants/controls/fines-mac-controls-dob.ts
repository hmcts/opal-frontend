import { FormControl } from '@angular/forms';
import { optionalValidDateValidator, dateOfBirthValidator } from '@validators';

export const FINES_MAC_CONTROLS_DOB = {
  dob: new FormControl(null, [optionalValidDateValidator(), dateOfBirthValidator()]),
};
