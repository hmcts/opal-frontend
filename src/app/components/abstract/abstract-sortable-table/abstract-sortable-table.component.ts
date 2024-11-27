import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState, IAbstractTableData } from './interfaces/abstract-sortable-table-interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  public abstractTableData!: IAbstractTableData<string | number | boolean>[] | null;
  public abstractExistingSortState!: IAbstractSortState | null;
  @Output() abstractSortState = new EventEmitter<IAbstractSortState>();

  private readonly sortService = inject(SortService);
  public sortState: IAbstractSortState = {};

  /**
   * Initializes the sort state for the table component.
   * If an existing sort state is present, it uses that; otherwise, it creates a new sort state based on the table data.
   *
   * @private
   * @returns {void}
   */
  private initialiseSortState(): void {
    const sortState = this.abstractExistingSortState || this.createSortState(this.abstractTableData);
    this.sortState = sortState;
  }

  /**
   * Creates an initial sort state for a table based on the provided table data.
   *
   * @param tableData - An array of table data objects. Each object represents a row in the table.
   * @returns An object representing the initial sort state for each column in the table.
   *          The keys of the object correspond to the column names, and the values are set to 'none'.
   */
  public createSortState(tableData: IAbstractTableData<string | number | boolean>[] | null): IAbstractSortState {
    const sortState: IAbstractSortState = {};

    if (tableData && tableData.length > 0) {
      Object.keys(tableData[0]).forEach((key) => {
        sortState[key] = 'none';
      });
    }

    return sortState;
  }

  /**
   * Handles the change in sorting order for the table.
   *
   * @param event - An object containing the key to sort by and the sort type (ascending or descending).
   * @param event.key - The key of the column to sort.
   * @param event.sortType - The type of sorting to apply ('ascending' or 'descending').
   *
   * Updates the sort state for each column, sorts the table data accordingly, and emits the updated sort state.
   */
  public onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    const { key, sortType } = event;
    Object.keys(this.sortState).forEach((key) => {
      this.sortState[key] = key === event.key ? event.sortType : 'none';
    });

    if (sortType === 'ascending') {
      this.abstractTableData = this.sortService.sortObjectArrayAsc(this.abstractTableData, key);
    } else {
      this.abstractTableData = this.sortService.sortObjectArrayDesc(this.abstractTableData, key);
    }

    this.abstractSortState.emit(this.sortState);
  }

  ngOnInit(): void {
    this.initialiseSortState();
  }
}
