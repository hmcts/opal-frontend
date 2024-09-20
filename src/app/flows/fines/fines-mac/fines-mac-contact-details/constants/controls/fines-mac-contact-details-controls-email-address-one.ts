import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { optionalEmailAddressValidator } from '@validators/optional-valid-email-address/optional-valid-email-address.validator';

export const FINES_MAC_CONTACT_DETAILS_CONTROLS_EMAIL_ADDRESS_ONE: IAbstractFormArrayControlValidation = {
  controlName: 'email_address_1',
  validators: [optionalMaxLengthValidator(76), optionalEmailAddressValidator()],
};
