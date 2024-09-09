import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK = {
  fieldName: 'vehicle_registration_mark',
  validators: [optionalMaxLengthValidator(11)],
};
