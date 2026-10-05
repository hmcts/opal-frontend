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

export interface IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection {
  accountId: number;
  selected: boolean;
}

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

  @Input() public selectedAccountIds: number[] = [];

  @Output() public accountSelectionChanged =
    new EventEmitter<IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection>();

  public override itemsPerPageSignal = signal(100);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  public isAccountSelected(accountId: number | null): boolean {
    return accountId !== null && this.selectedAccountIds.includes(accountId);
  }

  public onAccountSelectionChanged(accountId: number | null, event: Event): void {
    if (accountId !== null) {
      this.accountSelectionChanged.emit({
        accountId,
        selected: (event.target as HTMLInputElement).checked,
      });
    }
  }

  public preventAccountLinkNavigation(event: Event): void {
    event.preventDefault();
  }
}
