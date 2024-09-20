import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_TELEPHONE_NUMBER: IAbstractFormArrayControlValidation = {
  controlName: 'employer_telephone_number',
  validators: [optionalMaxLengthValidator(20), optionalPhoneNumberValidator()],
};
