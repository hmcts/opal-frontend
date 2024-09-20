import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_POSTCODE: IAbstractFormArrayControlValidation = {
  controlName: 'employer_postcode',
  validators: [optionalMaxLengthValidator(8)],
};
