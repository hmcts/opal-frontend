import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, signal, Output, computed } from '@angular/core';
import {
  MojSortableTableHeaderComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableRowComponent,
  MojSortableTableComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { IFinesDraftTableWrapperTableData } from './interfaces/fines-draft-table-wrapper-table-data.interface';
import { IFinesDraftTableWrapperTableSort } from './interfaces/fines-draft-table-wrapper-table-sort.interface';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { DaysAgoPipe } from '@hmcts/opal-frontend-common/pipes/days-ago';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FinesSharedSortableTableFooterComponent } from '../../components/fines-shared/fines-shared-sortable-table-footer/fines-shared-sortable-table-footer.component';
import { FINES_MAC_ACCOUNT_TYPES } from '../../fines-mac/constants/fines-mac-account-types';

@Component({
  selector: 'app-fines-draft-table-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    DaysAgoPipe,
    DateFormatPipe,
    FinesSharedSortableTableFooterComponent,
  ],
  templateUrl: './fines-draft-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  @Input({ required: true }) set tableData(tableData: IFinesDraftTableWrapperTableData[]) {
    this.setTableData(tableData);
  }
  @Input({ required: true }) set existingSortState(existingSortState: IFinesDraftTableWrapperTableSort | null) {
    this.abstractExistingSortState = existingSortState;
  }
  @Input({ required: false }) public activeTab: string = 'review';
  @Input({ required: false }) public isApprovedTab: boolean = false;
  @Input({ required: false }) public isChecker: boolean = false;
  @Output() public linkClicked = new EventEmitter<IFinesDraftTableWrapperTableData>();
  @Output() public accountClicked = new EventEmitter<string>();

  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesDraftTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public override itemsPerPageSignal = signal(25);

  /**
   * Handles the click event on a defendant.
   * Emits the clicked row.
   *
   * @param {IFinesDraftTableWrapperTableData} row - The row that was clicked.
   * @returns {void}
   */
  public onDefendantClick(row: IFinesDraftTableWrapperTableData): void {
    this.linkClicked.emit(row);
  }

  /**
   * Handles the click event on an account.
   * Emits the clicked account number.
   *
   * @param {number} account_number - the account number of the clicked account.
   * @returns {void}
   */
  public onAccountClick(account_number: string): void {
    this.accountClicked.emit(account_number);
  }
}
