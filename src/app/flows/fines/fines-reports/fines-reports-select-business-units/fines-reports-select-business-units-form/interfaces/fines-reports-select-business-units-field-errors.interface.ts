import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesReportsSelectBusinessUnitsFieldErrors extends IAbstractFormBaseFieldErrors {
  fines_reports_select_business_unit_ids: {
    required: {
      message: string;
      priority: number;
    };
  };
}
