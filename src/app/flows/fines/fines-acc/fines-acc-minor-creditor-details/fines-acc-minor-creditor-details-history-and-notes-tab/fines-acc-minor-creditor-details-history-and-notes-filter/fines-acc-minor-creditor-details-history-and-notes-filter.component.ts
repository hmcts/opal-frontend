import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';
import { IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm } from '../interfaces/fines-acc-minor-creditor-details-history-and-notes-filter-form.interface';
import { FinesAccMinorCreditorDetailsHistoryAndNotesFilterFormComponent } from './fines-acc-minor-creditor-details-history-and-notes-filter-form/fines-acc-minor-creditor-details-history-and-notes-filter-form.component';

@Component({
  selector: 'app-fines-acc-minor-creditor-details-history-and-notes-filter',
  imports: [FinesAccMinorCreditorDetailsHistoryAndNotesFilterFormComponent],
  templateUrl: './fines-acc-minor-creditor-details-history-and-notes-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccMinorCreditorDetailsHistoryAndNotesFilterComponent extends AbstractFormParentBaseComponent {
  @Input() public filterForm: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm | null = null;
  @Input() public filterOpen = false;
  @Output() public filterApplied = new EventEmitter<IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm>();
  @Output() public filterOpenChange = new EventEmitter<boolean>();

  /**
   * Emits the submitted filter form to the history and notes tab component.
   *
   * @param form - The submitted history and notes filter form.
   */
  public handleFilterSubmit(form: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm): void {
    this.filterApplied.emit(form);
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
