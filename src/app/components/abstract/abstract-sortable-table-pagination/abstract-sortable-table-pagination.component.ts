import { Component, computed, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';

@Component({
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  // Signal for the current page. Used to calculate the start and end indices for pagination.
  public currentPageSignal = signal(1);

  // Signal for the number of items per page. Determines how many items are displayed on each page.
  public itemsPerPageSignal = signal(10);

  // Signal for the start index (1-based). Automatically updates when `currentPageSignal` or `itemsPerPageSignal` changes.
  public startIndexComputed = computed(() => {
    const currentPage = this.currentPageSignal();
    return (currentPage - 1) * this.itemsPerPageSignal() + 1;
  });

  // Signal for the end index (1-based). Automatically recalculates when `startIndexComputed` or `abstractTableDataSignal` changes.
  public endIndexComputed = computed(() => {
    const startIndex = this.startIndexComputed();
    return Math.min(startIndex + this.itemsPerPageSignal() - 1, this.abstractTableDataSignal().length);
  });

  // Computed signal for paginated table data. Reactively slices `abstractTableDataSignal` based on `startIndexComputed` and `endIndexComputed`.
  public paginatedTableDataComputed = computed(() => {
    const data = this.abstractTableDataSignal(); // Full table data

    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed()); // Return paginated data subset
  });

  /**
   * Handles sorting changes and resets the page to the first page.
   *
   * @param event - The sorting event containing:
   *   - `key`: The column key to sort by.
   *   - `sortType`: The sorting order, either 'ascending' or 'descending'.
   *
   * Resets `currentPageSignal` to 1 and triggers re-sorting of `abstractTableDataSignal`.
   */
  public override onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    super.onSortChange(event); // Update the sort state and sort the data
    this.currentPageSignal.set(1); // Reset the page to the first page
  }

  /**
   * Handles the event when the page is changed.
   *
   * @param newPage - The new page number to set. If the provided page number is out of range,
   * it will be clamped between 1 and the total number of pages.
   */
  public onPageChange(newPage: number): void {
    const totalPages = Math.ceil(this.abstractTableDataSignal().length / this.itemsPerPageSignal());
    this.currentPageSignal.set(Math.max(1, Math.min(newPage, totalPages)));
  }
}
