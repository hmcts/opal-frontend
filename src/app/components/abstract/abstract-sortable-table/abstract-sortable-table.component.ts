import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState, IAbstractTableData } from './interfaces/abstract-sortable-table-interfaces';
import { SortableValues } from '@services/sort-service/types/sort-service-type';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  private readonly sortService = inject(SortService);

  public abstractTableData = signal<IAbstractTableData<SortableValues>[]>([]);
  public abstractExistingSortState: IAbstractSortState | null = null;
  public sortState = signal<IAbstractSortState>({});

  @Output() abstractSortState = new EventEmitter<IAbstractSortState>();

  /**
   * Creates an initial sort state for a table based on the provided table data.
   *
   * @param tableData - Array of table data objects representing table rows.
   * @returns Initial sort state object with column names as keys and 'none' as values.
   */
  private createSortState(tableData: IAbstractTableData<SortableValues>[] | null): IAbstractSortState {
    return tableData?.length
      ? Object.keys(tableData[0]).reduce<IAbstractSortState>((state, key) => {
          state[key] = 'none';
          return state;
        }, {})
      : {};
  }

  /**
   * Initializes the sort state by using the existing sort state if available,
   * or generating a new one based on the current table data.
   */
  private initialiseSortState(): void {
    this.sortState.set(this.abstractExistingSortState || this.createSortState(this.abstractTableData()));
  }

  /**
   * Updates the sort state for a given column key and sort type.
   * Resets the sort state for all other columns to 'none'.
   *
   * @param key - The column to sort by.
   * @param sortType - Sorting order ('ascending' or 'descending').
   */
  private updateSortState(key: string, sortType: 'ascending' | 'descending'): void {
    this.sortState.set(
      Object.keys(this.sortState()).reduce<IAbstractSortState>((state, columnKey) => {
        state[columnKey] = columnKey === key ? sortType : 'none';
        return state;
      }, {}),
    );
  }

  /**
   * Retrieves the sorted table data based on the specified key and sort type.
   *
   * @param key - The key of the property to sort by.
   * @param sortType - The type of sorting to apply, either 'ascending' or 'descending'.
   * @returns An array of sorted table data objects.
   */
  private getSortedTableData(key: string, sortType: 'ascending' | 'descending'): IAbstractTableData<SortableValues>[] {
    return sortType === 'ascending'
      ? (this.sortService.sortObjectArrayAsc(this.abstractTableData(), key) as IAbstractTableData<SortableValues>[])
      : (this.sortService.sortObjectArrayDesc(this.abstractTableData(), key) as IAbstractTableData<SortableValues>[]);
  }

  /**
   * Handles the change in sorting for the table.
   *
   * @param event - An object containing the key to sort by and the sort type.
   * @param event.key - The key of the column to sort.
   * @param event.sortType - The type of sorting to apply ('ascending' or 'descending').
   *
   * This method updates the sort state, sorts the table data based on the provided key and sort type,
   * updates the table data signal, and emits the updated sort state.
   */
  protected onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    const { key, sortType } = event;

    this.updateSortState(key, sortType);
    const sortedData = this.getSortedTableData(key, sortType);

    // Update the table data signal
    this.abstractTableData.set(sortedData);

    // Emit the updated sort state
    this.abstractSortState.emit(this.sortState());
  }

  /**
   * Lifecycle hook to initialise the sort state.
   */
  public ngOnInit(): void {
    this.initialiseSortState();
  }
}
