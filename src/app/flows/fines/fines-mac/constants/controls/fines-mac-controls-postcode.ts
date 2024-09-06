import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_POSTCODE = {
  controlName: 'postcode',
  initialValue: null,
  validators: [optionalMaxLengthValidator(8)],
};
