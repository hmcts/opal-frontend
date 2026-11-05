import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '@app/flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FinesMciCriminalAccountId } from '../../interfaces/fines-mci-criminal-account.interface';

export interface IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection {
  accountId: FinesMciCriminalAccountId;
  selected: boolean;
}

@Component({
  selector: 'app-fines-mci-payment-category-criminal-matches-table-wrapper',
  imports: [
    CommonModule,
    RouterLink,
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

  @Input({ required: true }) set tableData(tableData: IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[]) {
    this.setTableData(tableData);
    this.onApplyFilters();
  }

  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  @Input() public selectedAccountIds: FinesMciCriminalAccountId[] = [];

  @Output() public accountSelectionChanged =
    new EventEmitter<IFinesMciPaymentCategoryCriminalMatchesTableWrapperAccountSelection>();

  public override itemsPerPageSignal = signal(100);
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesMciPaymentCategoryCriminalMatchesTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  public isAccountSelected(accountId: FinesMciCriminalAccountId | null): boolean {
    return accountId !== null && this.selectedAccountIds.includes(accountId);
  }

  public onAccountSelectionChanged(accountId: FinesMciCriminalAccountId | null, event: Event): void {
    if (accountId !== null) {
      this.accountSelectionChanged.emit({
        accountId,
        selected: (event.target as HTMLInputElement).checked,
      });
    }
  }

  public getAccountDetailsRoute(accountId: FinesMciCriminalAccountId): (string | number)[] {
    return [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.children.defendant,
      accountId,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ];
  }
}
