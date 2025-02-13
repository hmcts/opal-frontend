import { IAbstractFormBaseForm } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-form.interface';
import { IFinesMacAccountCommentsNotesState } from './fines-mac-account-comments-notes-state.interface';

export interface IFinesMacAccountCommentsNotesForm extends IAbstractFormBaseForm<IFinesMacAccountCommentsNotesState> {
  formData: IFinesMacAccountCommentsNotesState;
  nestedFlow: boolean;
}
