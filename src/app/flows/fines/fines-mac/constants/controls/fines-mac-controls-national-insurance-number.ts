import { FormControl } from '@angular/forms';
import { nationalInsuranceNumberValidator } from '@validators';

export const FINES_MAC_CONTROLS_NATIONAL_INSURANCE_NUMBER = {
  national_insurance_number: new FormControl(null, [nationalInsuranceNumberValidator()]),
};
