import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';
import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_VEHICLE_MAKE: IAbstractFormArrayControlValidation = {
  controlName: 'vehicle_make',
  validators: [optionalMaxLengthValidator(30)],
};
