import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';
import { optionalMaxLengthValidator } from 'opal-frontend-common';

export const FINES_MAC_PERSONAL_DETAILS_VEHICLE_DETAILS_FIELDS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_personal_details_vehicle_make',
    validators: [optionalMaxLengthValidator(30)],
  },
  {
    controlName: 'fm_personal_details_vehicle_registration_mark',
    validators: [optionalMaxLengthValidator(11)],
  },
];
