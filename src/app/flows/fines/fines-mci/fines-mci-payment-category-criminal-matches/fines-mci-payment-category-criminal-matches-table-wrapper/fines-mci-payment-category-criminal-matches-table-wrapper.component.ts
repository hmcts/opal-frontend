import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FinesNotProvidedComponent } from '../../../components/fines-not-provided/fines-not-provided.component';
import { IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData } from './interfaces/fines-mci-payment-category-criminal-matches-table-wrapper-table-data.interface';
import { IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableSort } from './interfaces/fines-mci-payment-category-criminal-matches-table-wrapper-table-sort.interface';

@Component({
  selector: 'app-fines-mci-payment-category-criminal-matches-table-wrapper',
  imports: [
    CommonModule,
    CustomAccessibleMonetaryComponent,
    CustomHorizontalScrollPaneComponent,
    DateFormatPipe,
    FinesNotProvidedComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
  ],
  templateUrl: './fines-mci-payment-category-criminal-matches-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciPaymentCategoryCriminalMatchesTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  @Input({ required: true }) set tableData(
    tableData: IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[],
  ) {
    this.setTableData(tableData);
  }

  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  @Input() public selectedAccountId: number | null = null;

  @Output() public accountSelected = new EventEmitter<number>();

  public override itemsPerPageSignal = signal(100);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  public selectAccount(accountId: number | null): void {
    if (accountId !== null) {
      this.accountSelected.emit(accountId);
    }
  }

  public preventAccountLinkNavigation(event: Event): void {
    event.preventDefault();
  }
}
