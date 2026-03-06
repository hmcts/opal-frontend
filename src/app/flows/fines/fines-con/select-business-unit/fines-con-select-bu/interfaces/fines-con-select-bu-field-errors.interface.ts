import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesConSelectBuFieldErrors extends IAbstractFormBaseFieldErrors {
  fcon_select_bu_business_unit_id: IAbstractFormBaseFieldError;
  fcon_select_bu_defendant_type: IAbstractFormBaseFieldError;
}
