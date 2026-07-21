import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { FINES_REPORTS_ROUTING_PATHS } from '../../routing/constants/fines-reports-routing-paths.constant';

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
    RouterLink,
  ],
  templateUrl: './fines-reports-summary-list-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSummaryListTableWrapperComponent extends AbstractReportInstancesTableBaseComponent<IFinesReportsSummaryListTableData> {
  public readonly reportSummaryRoutingPath = `../${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}`;
  public override abstractExistingSortState: IFinesReportsSummaryListTableWrapperTableSort | null =
    FINES_REPORTS_SUMMARY_LIST_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  public override itemsPerPageSignal = signal(25);

  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesReportsSummaryListTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  /**
   * Checks whether a report row supports the selected download file type.
   *
   * @param row - The report instance table row to check.
   * @param supportedType - The download file type to check for.
   * @returns True when the file type is supported, otherwise false.
   */
  public hasSupportedDownloadType(row: IFinesReportsSummaryListTableData, supportedType: string): boolean {
    return row.supportedTypes
      .split(',')
      .map((type) => type.trim().toUpperCase())
      .includes(supportedType.toUpperCase());
  }
}
