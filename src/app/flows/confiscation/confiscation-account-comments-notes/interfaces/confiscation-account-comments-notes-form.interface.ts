import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IConfiscationAccountCommentsNotesState } from './confiscation-account-comments-notes-state.interface';

export interface IConfiscationAccountCommentsNotesForm
  extends IAbstractFormBaseForm<IConfiscationAccountCommentsNotesState> {
  formData: IConfiscationAccountCommentsNotesState;
  nestedFlow: boolean;
}
