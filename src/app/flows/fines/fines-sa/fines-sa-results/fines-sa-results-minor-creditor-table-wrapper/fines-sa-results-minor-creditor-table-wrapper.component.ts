import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { IFinesSaResultsMinorCreditorTableWrapperTableData } from './interfaces/fines-sa-results-minor-creditor-table-wrapper-table-data.interface';
import { IFinesSaResultsMinorCreditorTableWrapperTableSort } from './interfaces/fines-sa-results-minor-creditor-table-wrapper-table-sort.interface';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';
import { FinesSaResultsSharedTableCellComponent } from '../components/fines-sa-results-shared-table-cell/fines-sa-results-shared-table-cell.component';
import { FinesSaResultsSharedPaginationComponent } from '../components/fines-sa-results-shared-pagination/fines-sa-results-shared-pagination.component';
import { FinesSaResultsSharedTableStatusComponent } from '../components/fines-sa-results-shared-table-status/fines-sa-results-shared-table-status.component';

@Component({
  selector: 'app-fines-sa-results-minor-creditor-table-wrapper',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    CustomHorizontalScrollPaneComponent,
    FinesSaResultsSharedTableCellComponent,
    FinesSaResultsSharedPaginationComponent,
    FinesSaResultsSharedTableStatusComponent,
  ],
  templateUrl: './fines-sa-results-minor-creditor-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsMinorCreditorTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  @Input({ required: true }) set tableData(tableData: IFinesSaResultsMinorCreditorTableWrapperTableData[]) {
    this.setTableData(tableData);
  }
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesSaResultsMinorCreditorTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  @Input({ required: false }) public isCompany: boolean = false;
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesSaResultsMinorCreditorTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public override itemsPerPageSignal = signal(25);
  public readonly finesDefaultValues = FINES_DEFAULT_VALUES;

  @Output() public accountIdClicked = new EventEmitter<number>();

  /**
   * Emits an event when an account ID is clicked, passing the selected account ID.
   *
   * @param accountId - The account ID that was clicked.
   */
  public goToAccount(accountId: number): void {
    this.accountIdClicked.emit(accountId);
  }
}
