import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const FINES_REPORTS_SELECT_BUSINESS_UNITS_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  fines_reports_select_business_unit_ids: {
    required: {
      message: 'Select 1 or more business unit',
      priority: 1,
    },
  },
};
