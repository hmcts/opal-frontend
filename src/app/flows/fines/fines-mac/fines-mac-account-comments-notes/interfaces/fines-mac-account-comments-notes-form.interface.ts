import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesMacAccountCommentsNotesState } from './fines-mac-account-comments-notes-state.interface';

export interface IFinesMacAccountCommentsNotesForm extends IAbstractFormBaseForm<IFinesMacAccountCommentsNotesState> {
  formData: IFinesMacAccountCommentsNotesState;
  nestedFlow: boolean;
}
