import { Component, computed, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  // Signal for the current page. Used to calculate the start and end indices for pagination.
  public currentPage = signal(1);

  // Signal for the number of items per page. Determines how many items are displayed on each page.
  public itemsPerPage = signal(10);

  // Signal for the start index (1-based). Automatically updates when `currentPage` or `itemsPerPage` changes.
  public startIndex = computed(() => {
    const currentPage = this.currentPage();
    return (currentPage - 1) * this.itemsPerPage() + 1;
  });

  // Signal for the end index (1-based). Automatically recalculates when `startIndex` or `abstractTableData` changes.
  public endIndex = computed(() => {
    const startIndex = this.startIndex();
    return Math.min(startIndex + this.itemsPerPage() - 1, this.abstractTableData().length);
  });

  // Computed signal for paginated table data. Reactively slices `abstractTableData` based on `startIndex` and `endIndex`.
  public paginatedTableData = computed(() => {
    const data = this.abstractTableData(); // Full table data

    return data.slice(this.startIndex() - 1, this.endIndex()); // Return paginated data subset
  });

  /**
   * Handles sorting changes and resets the page to the first page.
   *
   * @param event - The sorting event containing:
   *   - `key`: The column key to sort by.
   *   - `sortType`: The sorting order, either 'ascending' or 'descending'.
   *
   * Resets `currentPage` to 1 and triggers re-sorting of `abstractTableData`.
   */
  public override onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    super.onSortChange(event); // Update the sort state and sort the data
    this.currentPage.set(1); // Reset the page to the first page
  }

  /**
   * Handles the event when the page is changed.
   *
   * @param newPage - The new page number to set. If the provided page number is out of range,
   * it will be clamped between 1 and the total number of pages.
   */
  public onPageChange(newPage: number): void {
    const totalPages = Math.ceil(this.abstractTableData().length / this.itemsPerPage());
    this.currentPage.set(Math.max(1, Math.min(newPage, totalPages)));
  }
}
