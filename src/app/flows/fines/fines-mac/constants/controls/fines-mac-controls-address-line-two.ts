import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_ADDRESS_LINE_TWO: IAbstractFormArrayControlValidation = {
  controlName: 'address_line_2',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
