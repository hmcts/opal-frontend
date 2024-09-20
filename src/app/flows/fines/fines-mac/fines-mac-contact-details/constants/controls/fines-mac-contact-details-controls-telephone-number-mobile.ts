import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalPhoneNumberValidator } from '@validators/optional-valid-telephone/optional-valid-telephone.validator';

export const FINES_MAC_CONTACT_DETAILS_CONTROLS_TELEPHONE_NUMBER_MOBILE: IAbstractFormArrayControlValidation = {
  controlName: 'telephone_number_mobile',
  validators: [optionalMaxLengthValidator(35), optionalPhoneNumberValidator()],
};
