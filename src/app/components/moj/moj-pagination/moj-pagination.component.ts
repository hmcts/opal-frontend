import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { MojPaginationItemComponent } from './moj-pagination-item/moj-pagination-item.component';
import { MojPaginationListComponent } from './moj-pagination-list/moj-pagination-list.component';
import { MojPaginationLinkComponent } from './moj-pagination-link/moj-pagination-link.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moj-pagination',
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

  public pages = signal<(number | string)[]>([]);
  public totalPages = signal<number>(0);
  public startItem = signal<number>(0);
  public endItem = signal<number>(0);
  public totalItems = signal<number>(0);

  public ngOnChanges(): void {
    this.setSignals();
  }

  public setSignals(): void {
    this.totalPages.set(this.getTotalPages(this.total, this.limit));
    this.startItem.set(this.getStartItem(this.currentPage, this.limit));
    this.endItem.set(this.getEndItem(this.currentPage, this.limit, this.total));
    this.setPages();
    this.setTotalItems();
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

  private getTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
  private setPages(): void {
    this.pages.set(this.getPages(this.currentPage, this.totalPages()));
  }

  private getStartItem(currentPage: number, limit: number): number {
    return (currentPage - 1) * limit + 1;
  }

  private getEndItem(currentPage: number, limit: number, total: number): number {
    return Math.min(currentPage * limit, total);
  }
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
   * Calculates the range of pages to display in pagination based on the current page, total pages, and the number of pages to show on either side of the current page.
   *
   * @param currentPage - The current active page.
   * @param totalPages - The total number of pages available.
   * @param halfPagesToShow - The number of pages to show on either side of the current page.
   * @returns An object containing the start and end pages for the pagination range.
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
}
