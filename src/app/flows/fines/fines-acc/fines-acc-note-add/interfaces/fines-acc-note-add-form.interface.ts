import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccAddNoteFormState } from './fines-acc-note-add-form-state.interface';

export interface IFinesAccAddNoteForm extends IAbstractFormBaseForm<IFinesAccAddNoteFormState> {
  formData: IFinesAccAddNoteFormState;
}
