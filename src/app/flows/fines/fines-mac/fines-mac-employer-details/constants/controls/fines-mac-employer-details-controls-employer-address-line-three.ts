import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { specialCharactersValidator } from '@validators/special-characters/special-characters.validator';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_ADDRESS_LINE_THREE: IAbstractFormArrayControlValidation = {
  controlName: 'employer_address_line_3',
  validators: [optionalMaxLengthValidator(30), specialCharactersValidator()],
};
