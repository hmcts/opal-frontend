import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccEnfCourtChangeFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_enf_court: IAbstractFormBaseFieldError;
}
