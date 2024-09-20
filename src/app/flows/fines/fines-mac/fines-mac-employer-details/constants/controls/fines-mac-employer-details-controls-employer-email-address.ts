import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalEmailAddressValidator } from '@validators/optional-valid-email-address/optional-valid-email-address.validator';

export const FINES_MAC_EMPLOYER_DETAILS_CONTROLS_EMPLOYER_EMAIL_ADDRESS: IAbstractFormArrayControlValidation = {
  controlName: 'employer_email_address',
  validators: [optionalMaxLengthValidator(76), optionalEmailAddressValidator()],
};
