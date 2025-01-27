import { Component, OnInit } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';

@Component({
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent
  extends AbstractSortableTableComponent
  implements OnInit
{
  /**
   * Updates the paginated data for the table based on the current page and items per page.
   *
   * This method calculates the start and end indices for the current page and slices the
   * `abstractTableData` array to get the data for the current page. If `abstractTableData`
   * is not available, it sets `abstractPaginatedData` to null.
   *
   * @returns {void}
   */
  public updatePaginatedData(): void {
    const startIndex = (this.abstractCurrentPage - 1) * this.abstractItemsPerPage;
    const endIndex = startIndex + this.abstractItemsPerPage;
    if (this.abstractTableData) {
      this.abstractPaginatedData = this.abstractTableData.slice(startIndex, endIndex);
    } else {
      this.abstractPaginatedData = null;
    }
  }

  /**
   * Handles the event when the page is changed.
   * Updates the current page number and refreshes the paginated data.
   *
   * @param newPage - The new page number to set.
   */
  public onPageChange(newPage: number): void {
    this.abstractCurrentPage = newPage;
    this.updatePaginatedData();
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * This method is used to perform any necessary initialization for the component.
   *
   * In this implementation, it calls `updatePaginatedData` to ensure that the paginated data
   * is updated when the component is initialized.
   *
   * @override
   */
  public override ngOnInit(): void {
    this.updatePaginatedData();
  }
}
