import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE = {
  fieldName: 'vehicle_make',
  validators: [optionalMaxLengthValidator(30)],
};
