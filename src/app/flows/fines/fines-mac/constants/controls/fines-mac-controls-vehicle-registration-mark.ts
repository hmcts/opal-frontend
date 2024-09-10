import { optionalMaxLengthValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_VEHICLE_REGISTRATION_MARK: IAbstractFormArrayControlValidation = {
  controlName: 'vehicle_registration_mark',
  validators: [optionalMaxLengthValidator(11)],
};
