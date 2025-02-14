import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesConfAccountCommentsNotesState } from './fines-conf-account-comments-notes-state.interface';

export interface IFinesConfAccountCommentsNotesForm extends IAbstractFormBaseForm<IFinesConfAccountCommentsNotesState> {
  formData: IFinesConfAccountCommentsNotesState;
  nestedFlow: boolean;
}
