import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from '@validators/optional-max-length/optional-max-length.validator';

export const CONFISCATION_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'conf_personal_details_vehicle_make',
    validators: [optionalMaxLengthValidator(30)],
  },
  {
    controlName: 'conf_personal_details_vehicle_registration_mark',
    validators: [optionalMaxLengthValidator(11)],
  },
];
