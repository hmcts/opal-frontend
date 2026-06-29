import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
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
export class FinesAccountHistoryTableComponent {
  public readonly columns = FINES_ACCOUNT_HISTORY_TABLE_COLUMNS;
  public readonly tableDisplay = FINES_ACCOUNT_HISTORY_TABLE_DISPLAY;

  public readonly rowsSignal = signal<IFinesAccountHistoryTableRow[]>([]);
  public readonly sortStateSignal = signal<TFinesAccountHistoryTableSortState>(
    this.createSortState(
      FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column,
      FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.direction,
    ),
  );
  public readonly sortedColumnTitleSignal = signal<TFinesAccountHistoryTableColumn>(
    FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column,
  );
  public readonly sortedColumnDirectionSignal = signal<TFinesAccountHistoryTableSortDirection>(
    FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.direction,
  );
  public readonly sortedRows = computed(() =>
    this.sortRows(this.rowsSignal(), this.sortedColumnTitleSignal(), this.sortedColumnDirectionSignal()),
  );

  @Output() public historyLinkClicked = new EventEmitter<IFinesAccountHistoryTableLinkClick>();

  /**
   * Stores the rows supplied by a flow-owned history table adapter.
   *
   * @param rows - History table rows to render, or null when no rows are available.
   */
  @Input({ required: true }) public set rows(rows: IFinesAccountHistoryTableRow[] | null) {
    this.rowsSignal.set(rows ?? []);
  }

  /**
   * Creates the sortable table state for all columns.
   *
   * @param activeColumn - The column currently being sorted.
   * @param direction - The active column sort direction.
   * @returns Sort state keyed by table column.
   */
  private createSortState(
    activeColumn: TFinesAccountHistoryTableColumn,
    direction: TFinesAccountHistoryTableSortDirection,
  ): TFinesAccountHistoryTableSortState {
    return this.columns.reduce((state, column) => {
      state[column] = column === activeColumn ? direction : FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none;
      return state;
    }, {} as TFinesAccountHistoryTableSortState);
  }

  /**
   * Sorts history rows by the requested column and direction.
   *
   * @param rows - The rows to sort.
   * @param column - The table column to sort by.
   * @param direction - The requested sort direction.
   * @returns A sorted copy of the supplied rows.
   */
  private sortRows(
    rows: IFinesAccountHistoryTableRow[],
    column: TFinesAccountHistoryTableColumn,
    direction: TFinesAccountHistoryTableSortDirection,
  ): IFinesAccountHistoryTableRow[] {
    if (direction === FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none) {
      return [...rows];
    }

    return [...rows].sort((first, second) => {
      const comparison = this.compareValues(first[column], second[column]);
      return direction === FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending ? comparison : -comparison;
    });
  }

  /**
   * Compares nullable row values for sortable table ordering.
   *
   * @param first - The first value to compare.
   * @param second - The second value to compare.
   * @returns Sort comparison value.
   */
  private compareValues(first: string | number | null, second: string | number | null): number {
    if (first === null && second === null) {
      return this.tableDisplay.sortComparison.equal;
    }
    if (first === null) {
      return this.tableDisplay.sortComparison.firstAfterSecond;
    }
    if (second === null) {
      return this.tableDisplay.sortComparison.firstBeforeSecond;
    }
    if (typeof first === 'number' && typeof second === 'number') {
      return first - second;
    }

    return String(first).localeCompare(String(second), undefined, this.tableDisplay.localeCompareOptions);
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
   * Applies a supported sortable table sort change.
   *
   * @param event - The emitted sort change event.
   */
  public onSortChange(event: IFinesAccountHistoryTableSortChange): void {
    if (!this.isColumn(event.key) || event.sortType === FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none) {
      return;
    }

    this.sortStateSignal.set(this.createSortState(event.key, event.sortType));
    this.sortedColumnTitleSignal.set(event.key);
    this.sortedColumnDirectionSignal.set(event.sortType);
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
   * Tracks rendered details parts by index.
   *
   * @param index - The part index.
   * @returns The part index.
   */
  public trackPart(index: number): number {
    return index;
  }

  /**
   * Tracks rendered details fragments by index.
   *
   * @param index - The fragment index.
   * @returns The fragment index.
   */
  public trackFragment(index: number): number {
    return index;
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
    if (fragment.hyphen) {
      return this.tableDisplay.hyphenPrefix;
    }

    return index > 0 ? this.tableDisplay.fragmentSpacePrefix : this.tableDisplay.fragmentEmptyPrefix;
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
