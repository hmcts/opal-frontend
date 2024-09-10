import { optionalMaxLengthValidator } from '@validators';
import { IAbstractFormArrayControlValidation } from '../../../../../components/abstract/interfaces/abstract-form-array-control-validation.interface';

export const FINES_MAC_CONTROLS_POSTCODE: IAbstractFormArrayControlValidation = {
  controlName: 'postcode',
  validators: [optionalMaxLengthValidator(8)],
};
