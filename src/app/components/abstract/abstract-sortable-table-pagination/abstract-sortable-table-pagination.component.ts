import { ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';
import { SortableValues } from '@services/sort-service/types/sort-service-type';
import { IAbstractTableData } from '../abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent extends AbstractSortableTableComponent {
  public currentPage = signal(1);
  public itemsPerPage: number = 10;
  public paginatedTableData!: IAbstractTableData<SortableValues>[];

  /**
   * Initializes the pagination component and sets up an effect to reactively compute
   * paginated data based on changes to the full dataset or pagination state.
   *
   * @param cdr - Angular's ChangeDetectorRef to trigger change detection when needed.
   */
  constructor(private readonly cdr: ChangeDetectorRef) {
    super();

    effect(() => {
      const data = this.abstractTableData();

      const startIndex = this.startIndex - 1;
      const endIndex = this.endIndex;

      this.paginatedTableData = data.slice(startIndex, endIndex);

      cdr.detectChanges();
    });
  }

  /**
   * Compute the start index for the current page (1-based index).
   */
  protected get startIndex(): number {
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  }

  /**
   * Compute the end index for the current page (1-based index).
   */
  protected get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.abstractTableData().length);
  }

  /**
   * Handles sorting changes and resets the page to the first page.
   *
   * @param event - The sorting event containing:
   *   - `key`: The column key to sort by.
   *   - `sortType`: The sorting order, either 'ascending' or 'descending'.
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
    const totalPages = Math.ceil(this.abstractTableData().length / this.itemsPerPage);
    this.currentPage.set(Math.max(1, Math.min(newPage, totalPages)));
  }
}
