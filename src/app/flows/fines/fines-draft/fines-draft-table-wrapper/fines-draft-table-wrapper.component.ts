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
import { MojFilterComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
import { MojFilterPanelComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel';
import { MojFilterPanelHeaderComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-header';
import { MojFilterPanelOptionComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-option';
import { MojFilterPanelOptionFormGroupKeywordComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-option/moj-filter-panel-option-form-group-keyword';
import { MojFilterPanelOptionFormGroupItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-option/moj-filter-panel-option-form-group-item';
import { MojFilterPanelSelectedComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-selected';
import { MojFilterPanelSelectedTagComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-selected/moj-filter-panel-selected-tag';
import { IAbstractTableFilterCategory } from '@hmcts/opal-frontend-common/components/abstract/abstract-table-filter/interfaces';

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
    MojFilterComponent,
    MojFilterPanelComponent,
    MojFilterPanelHeaderComponent,
    MojFilterPanelOptionComponent,
    MojFilterPanelOptionFormGroupKeywordComponent,
    MojFilterPanelOptionFormGroupItemComponent,
    MojFilterPanelSelectedComponent,
    MojFilterPanelSelectedTagComponent,
  ],
  templateUrl: './fines-draft-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesDraftTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesDraftTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });

  public override itemsPerPageSignal = signal(25);
  @Input({ required: true }) set tableData(tableData: IFinesDraftTableWrapperTableData[]) {
    this.setTableData(tableData);
  }
  @Input({ required: true }) set existingSortState(existingSortState: IFinesDraftTableWrapperTableSort | null) {
    this.abstractExistingSortState = existingSortState;
  }
  @Input({ required: false }) set tags(tags: IAbstractTableFilterCategory[]) {
    this.filterTags.set(tags);
  }
  @Input({ required: false }) public activeTab: string = 'review';
  @Input({ required: false }) public isApprovedTab: boolean = false;
  @Input({ required: false }) public isChecker: boolean = false;
  @Output() public linkClicked = new EventEmitter<number>();
  @Output() public accountClicked = new EventEmitter<string>();

  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';

  /**
   * Handles the click event on a defendant.
   * Emits the clicked defendant's ID.
   *
   * @param {number} id - The ID of the clicked defendant.
   * @returns {void}
   */
  public onDefendantClick(id: number): void {
    this.linkClicked.emit(id);
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
