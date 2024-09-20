import { Validators } from '@angular/forms';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_ONE: IAbstractFormArrayControlValidation = {
  controlName: 'employer_address_line_1',
  validators: [Validators.required, Validators.maxLength(30), specialCharactersValidator()],
};
