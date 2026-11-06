import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { FinesAccHistoryAndNotesFilterFormComponent } from '../../../fines-acc-history-and-notes/fines-acc-history-and-notes-filter-form/fines-acc-history-and-notes-filter-form.component';
import { IFinesAccHistoryAndNotesFilterForm } from '../../../fines-acc-history-and-notes/interfaces/fines-acc-history-and-notes-filter-form.interface';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_CATEGORIES } from '../constants/fines-acc-defendant-details-history-and-notes-filter-categories.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS } from '../constants/fines-acc-defendant-details-history-and-notes-filter-field-errors.constant';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT } from '../constants/fines-acc-defendant-details-history-and-notes-filter-summary-text.constant';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-history-and-notes-filter',
  imports: [FinesAccHistoryAndNotesFilterFormComponent],
  templateUrl: './fines-acc-defendant-details-history-and-notes-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsHistoryAndNotesFilterComponent extends AbstractFormParentBaseComponent {
  public readonly categories = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_CATEGORIES;
  public readonly fieldErrors = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FIELD_ERRORS;
  public readonly summaryText = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_SUMMARY_TEXT;

  @Input() public filterForm: IFinesAccDefendantDetailsHistoryAndNotesFilterForm | null = null;
  @Input() public filterOpen = false;
  @Output() public filterApplied = new EventEmitter<IFinesAccDefendantDetailsHistoryAndNotesFilterForm>();
  @Output() public filterOpenChange = new EventEmitter<boolean>();

  /**
   * Emits the submitted filter form to the history and notes tab component.
   *
   * @param form - The submitted history and notes filter form.
   */
  public handleFilterSubmit(form: IFinesAccHistoryAndNotesFilterForm): void {
    this.filterApplied.emit(form as IFinesAccDefendantDetailsHistoryAndNotesFilterForm);
  }

  /**
   * Tracks whether the nested filter form has unsaved changes.
   *
   * @param unsavedChanges - Whether the child form currently contains unsaved changes.
   */
  public handleUnsavedChanges(unsavedChanges: boolean): void {
    this.stateUnsavedChanges = unsavedChanges;
  }

  /**
   * Emits the filter details open state to the history and notes tab component.
   *
   * @param open - Whether the filter details are open.
   */
  public handleFilterOpenChange(open: boolean): void {
    this.filterOpenChange.emit(open);
  }
}
