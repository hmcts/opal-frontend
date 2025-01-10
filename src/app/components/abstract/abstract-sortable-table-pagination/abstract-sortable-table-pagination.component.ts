import { Component, effect, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';
import { SortableValues } from '@services/sort-service/types/sort-service-type';
import { IAbstractTableData } from '../abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  public abstractTablePaginatedCurrentPage = signal(1);
  public abstractTablePaginatedItemsPerPage = signal(0);
  public abstractTablePaginatedStartIndex = signal(0);
  public abstractTablePaginatedEndIndex = signal(0);
  public abstractTablePaginatedData = signal<IAbstractTableData<SortableValues>[]>([]);

  constructor() {
    super();

    // Effect to handle paginated data updates
    effect(
      this.updatePaginatedData.bind(this),
      { allowSignalWrites: true }, // Enable signal writes inside this effect
    );
  }

  /**
   * Updates the paginated data for the table.
   *
   * This method calculates the start and end indices for the current page based on the current page number
   * and the number of items per page. It then slices the data array to get the items for the current page
   * and updates the paginated data, start index, and end index accordingly.
   *
   * @private
   * @returns {void}
   */
  private updatePaginatedData(): void {
    const currentPage = this.abstractTablePaginatedCurrentPage();
    const itemsPerPage = this.abstractTablePaginatedItemsPerPage();
    const data = this.abstractTableData();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    this.abstractTablePaginatedStartIndex.set(startIndex + 1);
    this.abstractTablePaginatedEndIndex.set(endIndex);
    this.abstractTablePaginatedData.set(data.slice(startIndex, endIndex));
  }

  /**
   * Handles the event when the page is changed.
   *
   * @param newPage - The new page number to set.
   * @returns void
   */
  public onPageChange(newPage: number): void {
    this.abstractTablePaginatedCurrentPage.set(newPage);
  }
}
