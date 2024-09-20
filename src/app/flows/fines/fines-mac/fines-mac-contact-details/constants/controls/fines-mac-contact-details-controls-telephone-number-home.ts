import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';

export const FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_HOME: IAbstractFormArrayControlValidation = {
  controlName: 'telephone_number_home',
  validators: [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
};
