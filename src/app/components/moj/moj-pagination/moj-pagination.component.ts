import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moj-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moj-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() limit = 10;
  @Output() changePage = new EventEmitter<number>();

  public pages: (number | string)[] = [];
  public totalPages = 0;
  public startItem = 0;
  public endItem = 0;
  public totalItems = 0;

  ngOnChanges(): void {
    this.calculatePages();
  }

  /**
   * Handles the page change event when a user clicks on a pagination control.
   *
   * @param {MouseEvent} event - The mouse event triggered by the user's click.
   * @param {number} page - The page number to navigate to.
   * @returns {void}
   *
   * @remarks
   * This method prevents the default action of the event and checks if the page number
   * is different from the current page and within the valid range. If so, it emits the
   * `changePage` event with the new page number.
   */
  changePageEvent(event: MouseEvent, page: number): void {
    event.preventDefault();
    if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
      this.changePage.emit(page);
    }
  }

  /**
   * Calculates the pagination details including total pages, current page items range, and total items.
   *
   * - `totalPages`: The total number of pages calculated based on the total items and items per page limit.
   * - `pages`: An array of page numbers to be displayed, calculated based on the current page and total pages.
   * - `startItem`: The index of the first item on the current page.
   * - `endItem`: The index of the last item on the current page.
   * - `totalItems`: The total number of items.
   *
   * @private
   */
  private calculatePages(): void {
    this.totalPages = Math.ceil(this.total / this.limit);
    this.pages = this.getPages(this.currentPage, this.totalPages);
    this.startItem = (this.currentPage - 1) * this.limit + 1;
    this.endItem = Math.min(this.currentPage * this.limit, this.total);
    this.totalItems = this.total;
  }

  /**
   * Generates an array of page numbers and ellipses for pagination display.
   *
   * @param currentPage - The current active page number.
   * @param totalPages - The total number of pages available.
   * @returns An array of page numbers and ellipses representing the pagination.
   *
   * The function ensures that the current page is centered within the pagination display,
   * showing a maximum of 5 pages at a time. It includes ellipses ('...') to indicate
   * skipped pages when there are more pages than can be displayed.
   *
   * Example:
   * - If `currentPage` is 3 and `totalPages` is 10, the output might be [1, '...', 2, 3, 4, 5, '...', 10].
   * - If `currentPage` is 1 and `totalPages` is 3, the output will be [1, 2, 3].
   */
  private getPages(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    switch (true) {
      case currentPage - halfPagesToShow <= 0:
        endPage = Math.min(totalPages, endPage + (halfPagesToShow - currentPage + 1));
        break;
      case currentPage + halfPagesToShow > totalPages:
        startPage = Math.max(1, startPage - (currentPage + halfPagesToShow - totalPages));
        break;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift('...');
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }
}
