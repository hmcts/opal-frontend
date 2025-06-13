import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { optionalMaxLengthValidator } from '@hmcts/opal-frontend-common/validators/optional-max-length';

export const FINES_MAC_FIXED_PENALTY_DETAILS_VEHICLE_DETAILS_FIELDS: IAbstractFormArrayControlValidation[] = [
  {
    controlName: 'fm_fp_personal_details_vehicle_make',
    validators: [optionalMaxLengthValidator(30)],
  },
  {
    controlName: 'fm_fp_personal_details_vehicle_registration_mark',
    validators: [optionalMaxLengthValidator(11)],
  },
];
