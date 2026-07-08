import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccHistoryAndNotesFilterFormState } from './fines-acc-history-and-notes-filter-form-state.interface';

export interface IFinesAccHistoryAndNotesFilterForm extends IAbstractFormBaseForm<IFinesAccHistoryAndNotesFilterFormState> {
  formData: IFinesAccHistoryAndNotesFilterFormState;
}
