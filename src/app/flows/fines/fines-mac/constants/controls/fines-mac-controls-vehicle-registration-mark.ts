import { optionalMaxLengthValidator } from '@validators';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK = {
  controlName: 'vehicle_registration_mark',
  initialValue: null,
  validators: [optionalMaxLengthValidator(11)],
};
