import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccEnfColloChangeFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_enf_collection_order_made: IAbstractFormBaseFieldError;
}
