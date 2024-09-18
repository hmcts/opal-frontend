import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO: IAbstractFormArrayControlValidation = {
  controlName: 'address_line_2',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
