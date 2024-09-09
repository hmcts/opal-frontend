import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_POSTCODE = {
  fieldName: 'postcode',
  validators: [optionalMaxLengthValidator(8)],
};
