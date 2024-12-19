import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { SortService } from '@services/sort-service/sort-service';
import { IAbstractSortState, IAbstractTableData } from './interfaces/abstract-sortable-table-interfaces';
import { SortableValues } from '@services/sort-service/types/sort-service-type';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTableComponent implements OnInit {
  public abstractTableData!: IAbstractTableData<SortableValues>[] | null;
  public abstractExistingSortState!: IAbstractSortState | null;
  @Output() abstractSortState = new EventEmitter<IAbstractSortState>();

  private readonly sortService = inject(SortService);
  public sortState: IAbstractSortState = {};

  public currentPage = signal(1);
  public pageLimit = signal(25);
  public startItem = signal(1);
  public endItem = signal(25);
  public paginatedTableData!: IAbstractTableData<SortableValues>[] | null;

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
  private createSortState(tableData: IAbstractTableData<SortableValues>[] | null): IAbstractSortState {
    const sortState: IAbstractSortState = {};

    if (tableData && tableData.length > 0) {
      Object.keys(tableData[0]).forEach((key) => {
        sortState[key] = 'none';
      });
    }

    return sortState;
  }

  /**
   * Updates the paginated data for the table.
   *
   * This method calculates the start and end indices for the current page based on the current page number and page limit.
   * It then sets the start and end item indices and slices the abstract table data to get the data for the current page.
   *
   * @private
   */
  private updatePaginatedTableData(): void {
    const startIndex = (this.currentPage() - 1) * this.pageLimit();
    const endIndex = startIndex + this.pageLimit();
    const dataLength = this.abstractTableData?.length ?? 0;

    this.startItem.set(startIndex + 1);
    this.endItem.set(Math.min(endIndex, dataLength));

    this.paginatedTableData = this.abstractTableData?.slice(startIndex, endIndex) ?? this.abstractTableData;
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
  protected onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
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

  /**
   * Handles the event when the page number is changed.
   *
   * @param newPageNumber - The new page number to set.
   * @returns void
   */
  public handlePageChanged(newPageNumber: number): void {
    this.currentPage.set(newPageNumber);
    this.updatePaginatedTableData();
  }

  public ngOnInit(): void {
    this.initialiseSortState();
    this.updatePaginatedTableData();
  }
}
