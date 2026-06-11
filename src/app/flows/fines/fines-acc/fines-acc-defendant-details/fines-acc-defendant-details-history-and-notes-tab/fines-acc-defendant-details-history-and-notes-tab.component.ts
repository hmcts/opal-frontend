import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinesAccDefendantDetailsHistoryAndNotesFilterComponent } from './fines-acc-defendant-details-history-and-notes-filter/fines-acc-defendant-details-history-and-notes-filter.component';
import { FINES_ACC_SUMMARY_TABS_CONTENT_STYLES } from '../../constants/fines-acc-summary-tabs-content-styles.constant';
import { IFinesAccSummaryTabsContentStyles } from '../interfaces/fines-acc-summary-tabs-content-styles.interface';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from './interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';

@Component({
  selector: 'app-fines-acc-defendant-details-history-and-notes-tab',
  imports: [FinesAccDefendantDetailsHistoryAndNotesFilterComponent],
  templateUrl: './fines-acc-defendant-details-history-and-notes-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccDefendantDetailsHistoryAndNotesTabComponent {
  @Input({ required: true }) public tabData!: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData;
  @Input() public style: IFinesAccSummaryTabsContentStyles = FINES_ACC_SUMMARY_TABS_CONTENT_STYLES;
  @Output() public filterApplied = new EventEmitter<IFinesAccDefendantDetailsHistoryAndNotesFilterForm>();

  /**
   * Emits submitted history and notes filter values to the parent account details component.
   *
   * @param filter - The submitted history and notes filter form.
   */
  public handleFilterApplied(filter: IFinesAccDefendantDetailsHistoryAndNotesFilterForm): void {
    this.filterApplied.emit(filter);
  }
}
