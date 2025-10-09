import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesAccAddNoteFieldErrors extends IAbstractFormBaseFieldErrors {
  facc_add_notes: IAbstractFormBaseFieldError;
}
