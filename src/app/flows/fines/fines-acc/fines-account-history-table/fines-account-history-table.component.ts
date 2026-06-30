import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import type { IAbstractTableData } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import type { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';
import {
  getHistoryMappingFragmentPrefix,
  IHistoryDetails,
  IHistoryDetailsFragment,
  IHistoryDetailsLink,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACCOUNT_HISTORY_TABLE_COLUMNS } from './constants/fines-account-history-table-columns.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT } from './constants/fines-account-history-table-default-sort.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from './constants/fines-account-history-table-display.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS } from './constants/fines-account-history-table-sort-directions.constant';
import { IFinesAccountHistoryTableLinkClick } from './interfaces/fines-account-history-table-link-click.interface';
import { IFinesAccountHistoryTableRow } from './interfaces/fines-account-history-table-row.interface';
import { IFinesAccountHistoryTableSortChange } from './interfaces/fines-account-history-table-sort-change.interface';
import { TFinesAccountHistoryTableColumn } from './types/fines-account-history-table-column.type';
import { TFinesAccountHistoryTableSortDirection } from './types/fines-account-history-table-sort-direction.type';
import { TFinesAccountHistoryTableSortState } from './types/fines-account-history-table-sort-state.type';

@Component({
  selector: 'app-fines-account-history-table',
  imports: [
    CustomHorizontalScrollPaneComponent,
    DatePipe,
    MonetaryPipe,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    NgClass,
  ],
  templateUrl: './fines-account-history-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesAccountHistoryTableComponent extends AbstractSortableTableComponent {
  private hasInitialised = false;

  public readonly columns = FINES_ACCOUNT_HISTORY_TABLE_COLUMNS;
  public readonly tableDisplay = FINES_ACCOUNT_HISTORY_TABLE_DISPLAY;
  public override abstractExistingSortState: TFinesAccountHistoryTableSortState = this.createDefaultSortState(
    FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column,
    FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.direction,
  );
  public readonly sortedRows = computed(
    () => this.sortedTableDataSignal() as unknown as IFinesAccountHistoryTableRow[],
  );

  @Output() public historyLinkClicked = new EventEmitter<IFinesAccountHistoryTableLinkClick>();

  /**
   * Stores the rows supplied by a flow-owned history table adapter.
   *
   * @param rows - History table rows to render, or null when no rows are available.
   */
  @Input({ required: true }) public set rows(rows: IFinesAccountHistoryTableRow[] | null) {
    this.setTableData((rows ?? []) as unknown as IAbstractTableData<SortableValuesType>[]);

    if (this.hasInitialised) {
      this.onApplyFilters();
    }
  }

  /**
   * Creates the default sortable table state for all displayed columns.
   *
   * @param activeColumn - The column initially sorted.
   * @param direction - The initial sort direction.
   * @returns Sort state keyed by table column.
   */
  private createDefaultSortState(
    activeColumn: TFinesAccountHistoryTableColumn,
    direction: TFinesAccountHistoryTableSortDirection,
  ): TFinesAccountHistoryTableSortState {
    return this.columns.reduce((state, column) => {
      state[column] = column === activeColumn ? direction : FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none;
      return state;
    }, {} as TFinesAccountHistoryTableSortState);
  }

  /**
   * Checks whether a sort event key is a known table column.
   *
   * @param value - The sort event key.
   * @returns True when the key is a supported history table column.
   */
  private isColumn(value: string): value is TFinesAccountHistoryTableColumn {
    return this.columns.includes(value as TFinesAccountHistoryTableColumn);
  }

  /**
   * Keeps empty values after populated values once the common sortable table has applied column ordering.
   *
   * @param column - The sorted column.
   */
  private moveEmptySortValuesLast(column: TFinesAccountHistoryTableColumn): void {
    const sortedRows = this.sortedTableDataSignal() as unknown as IFinesAccountHistoryTableRow[];
    const populatedRows = sortedRows.filter((row) => row[column] !== null && row[column] !== undefined);
    const emptyRows = sortedRows.filter((row) => row[column] === null || row[column] === undefined);

    this.sortedTableDataSignal.set([
      ...populatedRows,
      ...emptyRows,
    ] as unknown as IAbstractTableData<SortableValuesType>[]);
  }

  /**
   * Applies a supported sortable table sort change.
   *
   * @param event - The emitted sort change event.
   */
  public override onSortChange(event: IFinesAccountHistoryTableSortChange): void {
    if (!this.isColumn(event.key) || event.sortType === FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none) {
      return;
    }

    super.onSortChange({ key: event.key, sortType: event.sortType });
    this.moveEmptySortValuesLast(event.key);
  }

  /**
   * Initialises inherited sort state after Angular has applied the required rows input.
   */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.hasInitialised = true;
  }

  /**
   * Emits link metadata for flow-owned navigation handling.
   *
   * @param row - The row containing the clicked link.
   * @param link - The clicked history details link.
   * @param event - The click event to prevent browser navigation.
   */
  public handleLinkClick(row: IFinesAccountHistoryTableRow, link: IHistoryDetailsLink, event: Event): void {
    event.preventDefault();
    this.historyLinkClicked.emit({
      ...link,
      rowId: row.id,
    });
  }

  /**
   * Checks whether a history details value has a second rendered line.
   *
   * @param details - The transformed history details value.
   * @returns True when line 2 contains at least one part.
   */
  public hasLine2(details: IHistoryDetails): boolean {
    return !!details.line2?.length;
  }

  /**
   * Tracks rendered history rows by stable row id.
   *
   * @param _index - The row index.
   * @param row - The rendered history row.
   * @returns The stable row id.
   */
  public trackRow(_index: number, row: IFinesAccountHistoryTableRow): string {
    return row.id;
  }

  /**
   * Gets the GOV.UK tag classes for a row amount direction.
   *
   * @param row - The rendered history row.
   * @returns CSS class map for the amount tag.
   */
  public getAmountTagClasses(row: IFinesAccountHistoryTableRow): Record<string, boolean> {
    return {
      [this.tableDisplay.cssClasses.amountTag]: true,
      [this.tableDisplay.cssClasses.amountTagCredit]: row.amountTag === this.tableDisplay.amountTags.credit,
      [this.tableDisplay.cssClasses.amountTagDebit]: row.amountTag === this.tableDisplay.amountTags.debit,
    };
  }

  /**
   * Gets the rendered text prefix for a details fragment.
   *
   * @param fragment - The details fragment.
   * @param index - The fragment index within its part.
   * @returns The fragment text prefix.
   */
  public getFragmentPrefix(fragment: IHistoryDetailsFragment, index: number): string {
    return getHistoryMappingFragmentPrefix(fragment, index, {
      fragmentEmptyPrefix: this.tableDisplay.fragmentEmptyPrefix,
      fragmentSpacePrefix: this.tableDisplay.fragmentSpacePrefix,
      hyphenPrefix: this.tableDisplay.hyphenPrefix,
    });
  }

  /**
   * Narrows a fragment value for Angular template type checking.
   *
   * @param fragment - The details fragment.
   * @returns The same fragment with its interface type.
   */
  public asFragment(fragment: IHistoryDetailsFragment): IHistoryDetailsFragment {
    return fragment;
  }
}
