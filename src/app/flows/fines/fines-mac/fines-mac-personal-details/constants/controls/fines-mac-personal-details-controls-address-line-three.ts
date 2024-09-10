import { optionalMaxLengthValidator, specialCharactersValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_PERSONAL_DETAILS_CONTROLS_ADDRESS_LINE_THREE: IAbstractFormArrayControlValidation = {
  controlName: 'address_line_3',
  validators: [optionalMaxLengthValidator(16), specialCharactersValidator()],
};
