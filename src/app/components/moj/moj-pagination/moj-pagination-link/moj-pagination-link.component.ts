import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-moj-pagination-link',

  imports: [],
  templateUrl: './moj-pagination-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojPaginationLinkComponent {
  @Input({ required: true }) page: number | string = 1;
  @Input({ required: true }) currentPage: number = 1;
  @Input({ required: true }) totalPages: number = 1;
  @Input() changePage: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Checks if the given page number is not the current page.
   *
   * @param page - The page number to check.
   * @returns A boolean indicating whether the given page is not the current page.
   */

  private pageIsNotCurrentPage(page: number): boolean {
    return page !== this.currentPage;
  }

  /**
   * Checks if the given page number is not negative.
   *
   * @param page - The page number to check.
   * @returns `true` if the page number is greater than 0, otherwise `false`.
   */

  private pageIsNotNegative(page: number): boolean {
    return page > 0;
  }

  /**
   * Checks if the given page number is not greater than the total number of pages.
   *
   * @param page - The page number to check.
   * @returns `true` if the page number is less than or equal to the total number of pages, otherwise `false`.
   */

  private pageIsNotGreaterThanTotalPages(page: number): boolean {
    return page <= this.totalPages;
  }
  /**
   * Handles the page change event.
   *
   * @param event - The mouse event that triggered the page change.
   * @param page - The page number to change to.
   *
   * Prevents the default action of the event and checks if the page number is valid.
   * A valid page number is one that is not the current page, is greater than 0,
   * and is less than or equal to the total number of pages.
   * If the page number is valid, emits the changePage event with the new page number.
   */
  public changePageEvent(event: MouseEvent, page: number): void {
    event.preventDefault();

    if (this.pageIsNotCurrentPage(page) && this.pageIsNotNegative(page) && this.pageIsNotGreaterThanTotalPages(page)) {
      this.changePage.emit(page);
    }
  }
}
