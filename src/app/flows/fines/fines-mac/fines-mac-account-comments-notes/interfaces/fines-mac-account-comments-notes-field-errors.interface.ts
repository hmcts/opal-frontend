import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export interface IFinesMacAccountCommentsNotesFieldErrors extends IAbstractFormBaseFieldErrors {
  fm_account_comments_notes_comments: IAbstractFormBaseFieldError;
  fm_account_comments_notes_notes: IAbstractFormBaseFieldError;
}
