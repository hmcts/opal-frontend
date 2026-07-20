import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractReportInstancesTableBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-instances-table-base';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import { IFinesReportsSummaryListTableData } from '../interfaces/fines-reports-summary-list-table-data.interface';
import { IFinesReportsSummaryListTableWrapperTableSort } from './interfaces/fines-reports-summary-list-table-wrapper-table-sort.interface';
import { FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-reports-summary-list-table-wrapper-table-sort-default.constant';

@Component({
  selector: 'app-fines-reports-summary-list-table-wrapper',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojPaginationComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    CustomHorizontalScrollPaneComponent,
  ],
  templateUrl: './fines-reports-summary-list-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSummaryListTableWrapperComponent extends AbstractReportInstancesTableBaseComponent<IFinesReportsSummaryListTableData> {
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesReportsSummaryListTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  constructor() {
    super();
    this.abstractExistingSortState = FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
    this.itemsPerPageSignal.set(25);
  }

  /**
   * Prevents placeholder report links from navigating until report actions are implemented.
   *
   * @param event - The selected placeholder link click event.
   */
  public onPlaceholderLinkClick(event: Event): void {
    event.preventDefault();
  }
}
