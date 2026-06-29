import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFormState } from './fines-acc-minor-creditor-details-history-and-notes-filter-form-state.interface';

export interface IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm
  extends IAbstractFormBaseForm<IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFormState> {
  formData: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterFormState;
}
