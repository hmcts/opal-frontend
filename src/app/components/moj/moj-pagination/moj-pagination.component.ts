import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  HostBinding,
} from '@angular/core';
import { MojPaginationItemComponent } from './moj-pagination-item/moj-pagination-item.component';
import { MojPaginationListComponent } from './moj-pagination-list/moj-pagination-list.component';
import { MojPaginationLinkComponent } from './moj-pagination-link/moj-pagination-link.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moj-pagination, [app-moj-pagination]',
  standalone: true,
  imports: [CommonModule, MojPaginationItemComponent, MojPaginationListComponent, MojPaginationLinkComponent],
  templateUrl: './moj-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() maxPagesToShow = 5;
  @Input() limit = 100;
  @Output() changePage = new EventEmitter<number>();
  @HostBinding('class') class = 'moj-pagination';

  public pages = signal<(number | string)[]>([]);
  public totalPages = signal<number>(0);
  public startItem = signal<number>(0);
  public endItem = signal<number>(0);
  public totalItems = signal<number>(0);

  /**
   * Updates the pagination signals based on the current state.
   *
   * This method recalculates and sets the following signals:
   * - `totalPages`: The total number of pages based on the total items and items per page limit.
   * - `startItem`: The index of the first item on the current page.
   * - `endItem`: The index of the last item on the current page.
   * - `pages`: The array of page numbers to be displayed.
   * - `totalItems`: The total number of items.
   *
   * @private
   */
  private setSignals(): void {
    this.totalPages.set(this.getTotalPages(this.total, this.limit));
    this.startItem.set(this.getStartItem(this.currentPage, this.limit));
    this.endItem.set(this.getEndItem(this.currentPage, this.limit, this.total));
    this.setPages();
    this.setTotalItems();
  }

  /**
   * Calculates the total number of pages based on the total number of items and the limit of items per page.
   *
   * @param total - The total number of items.
   * @param limit - The number of items per page.
   * @returns The total number of pages.
   */
  private getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
  /**
   * Sets the pagination pages based on the current page and total pages.
   * This method updates the `pages` property with the result of the `getPages` method.
   *
   * @private
   */
  private setPages(): void {
    this.pages.set(this.getPages(this.currentPage, this.totalPages()));
  }

  /**
   * Calculates the starting item index for pagination.
   *
   * @param currentPage - The current page number.
   * @param limit - The number of items per page.
   * @returns The starting item index for the given page.
   */
  private getStartItem(currentPage: number, limit: number): number {
    return (currentPage - 1) * limit + 1;
  }

  /**
   * Calculates the end item index for pagination.
   *
   * @param currentPage - The current page number.
   * @param limit - The number of items per page.
   * @param total - The total number of items.
   * @returns The index of the last item on the current page, or the total number of items if the end of the list is reached.
   */
  private getEndItem(currentPage: number, limit: number, total: number): number {
    return Math.min(currentPage * limit, total);
  }
  /**
   * Updates the total number of items by setting the value of `totalItems` to the current `total`.
   *
   * @private
   */
  private setTotalItems(): void {
    this.totalItems.set(this.total);
  }

  /**
   * Generates an array of page numbers and ellipses for pagination display.
   *
   * @param currentPage - The current active page number.
   * @param totalPages - The total number of pages available.
   * @returns An array of page numbers and ellipses representing the pagination.
   *
   * The function ensures that the pagination display shows a maximum of 5 pages at a time.
   * It calculates the range of pages to display based on the current page and total pages.
   * If the start page is greater than 1, it adds an ellipsis and the first page at the beginning.
   * If the end page is less than the total pages, it adds an ellipsis and the last page at the end.
   */
  private getPages(currentPage: number, totalPages: number): (number | string)[] {
    const halfPagesToShow = Math.floor(this.maxPagesToShow / 2);
    const eclipses = '...';

    const startPage = this.calculateStartPage(currentPage, totalPages, halfPagesToShow);
    const endPage = this.calculateEndPage(currentPage, totalPages, halfPagesToShow);

    const pages = this.generatePageNumbers(startPage, endPage);

    if (startPage > 1) {
      pages.unshift(eclipses);
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      pages.push(eclipses);
      pages.push(totalPages);
    }

    return pages;
  }

  /**
   * Calculates the start page for pagination based on the current page, total pages, and the number of pages to show on either side of the current page.
   *
   * @param currentPage - The current active page number.
   * @param totalPages - The total number of pages available.
   * @param halfPagesToShow - The number of pages to show on either side of the current page.
   * @returns The start page number for pagination.
   */
  private calculateStartPage(currentPage: number, totalPages: number, halfPagesToShow: number): number {
    let startPage = Math.max(1, currentPage - halfPagesToShow);

    if (currentPage - halfPagesToShow <= 0) {
      startPage = 1;
    } else if (currentPage + halfPagesToShow > totalPages) {
      startPage = Math.max(1, startPage - (currentPage + halfPagesToShow - totalPages));
    }

    return startPage;
  }

  /**
   * Calculates the end page number for pagination based on the current page, total pages, and the number of pages to show.
   *
   * @param currentPage - The current page number.
   * @param totalPages - The total number of pages.
   * @param halfPagesToShow - Half the number of pages to show around the current page.
   * @returns The calculated end page number.
   */
  private calculateEndPage(currentPage: number, totalPages: number, halfPagesToShow: number): number {
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (currentPage - halfPagesToShow <= 0) {
      endPage = Math.min(totalPages, endPage + (halfPagesToShow - currentPage + 1));
    } else if (currentPage + halfPagesToShow > totalPages) {
      endPage = totalPages;
    }

    return endPage;
  }

  /**
   * Generates an array of page numbers from the startPage to the endPage.
   *
   * @param startPage - The starting page number.
   * @param endPage - The ending page number.
   * @returns An array of page numbers from startPage to endPage.
   */
  private generatePageNumbers(startPage: number, endPage: number): (number | string)[] {
    const pages: (number | string)[] = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  public ngOnChanges(): void {
    this.setSignals();
  }
}
