import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccAddCommentsFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_add_comment: IAbstractFormBaseFieldError;
  facc_add_free_text_1: IAbstractFormBaseFieldError;
  facc_add_free_text_2: IAbstractFormBaseFieldError;
  facc_add_free_text_3: IAbstractFormBaseFieldError;
}
