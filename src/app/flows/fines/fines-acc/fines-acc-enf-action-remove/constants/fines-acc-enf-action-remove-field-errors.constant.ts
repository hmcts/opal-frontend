import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_ACC_ENF_ACTION_REMOVE_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  facc_enf_action_remove_reason: {
    maxlength: {
      message: 'Reason must be 24 characters or fewer',
      priority: 1,
    },
    alphanumericWithHyphensSpacesApostrophesPattern: {
      message: 'Reason must only include letters a to z, numbers, hyphens, spaces and apostrophes',
      priority: 2,
    },
  },
};
