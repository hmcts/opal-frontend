import { Validators } from '@angular/forms';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_ONE: IAbstractFormArrayControlValidation = {
  controlName: 'address_line_1',
  validators: [Validators.required, Validators.maxLength(30), specialCharactersValidator()],
};
