import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE = {
  controlName: 'vehicle_make',
  initialValue: null,
  validators: [optionalMaxLengthValidator(30)],
};
