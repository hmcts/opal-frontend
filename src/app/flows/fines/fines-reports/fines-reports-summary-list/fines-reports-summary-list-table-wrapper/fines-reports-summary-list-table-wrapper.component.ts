import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
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
export class FinesReportsSummaryListTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  @Input({ required: true }) set tableData(tableData: IFinesReportsSummaryListTableData[]) {
    this.setTableData(tableData);
    this.onApplyFilters();
  }

  @Input({ required: false }) set existingSortState(
    existingSortState: IFinesReportsSummaryListTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState ?? FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  }

  public override itemsPerPageSignal = signal(25);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesReportsSummaryListTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  constructor() {
    super();
    this.abstractExistingSortState = FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  }

}
