import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { FinesSharedSortableTableFooterComponent } from '../../../components/fines-shared/fines-shared-sortable-table-footer/fines-shared-sortable-table-footer.component';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { IFinesSaResultsDefendantTableWrapperTableData } from './interfaces/fines-sa-results-defendant-table-wrapper-table-data.interface';
import { IFinesSaResultsDefendantTableWrapperTableSort } from './interfaces/fines-sa-results-defendant-table-wrapper-table-sort.interface';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';

@Component({
  selector: 'app-fines-sa-results-defendant-table-wrapper',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    DateFormatPipe,
    NationalInsurancePipe,
    FinesSharedSortableTableFooterComponent,
  ],
  templateUrl: './fines-sa-results-defendant-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsDefendantTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  @Input({ required: true }) set tableData(tableData: IFinesSaResultsDefendantTableWrapperTableData[]) {
    this.setTableData(tableData);
  }
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesSaResultsDefendantTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  @Input({ required: false }) public isCompany: boolean = false;
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesSaResultsDefendantTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public override itemsPerPageSignal = signal(25);
  public readonly finesDefaultValues = FINES_DEFAULT_VALUES;

  @Output() public accountNumberClicked = new EventEmitter<string>();

  /**
   * Emits an event when an account number is clicked, passing the selected account number.
   *
   * @param accountNumber - The account number that was clicked.
   */
  public goToAccount(accountNumber: string): void {
    this.accountNumberClicked.emit(accountNumber);
  }
}
