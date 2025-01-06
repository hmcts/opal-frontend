import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-moj-pagination-link',
  standalone: true,
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

    const pageIsNotCurrentPage = page !== this.currentPage;
    const pageIsNotNegative = page > 0;
    const pageIsNotGreaterThanTotalPages = page <= this.totalPages;

    if (pageIsNotCurrentPage && pageIsNotNegative && pageIsNotGreaterThanTotalPages) {
      this.changePage.emit(page);
    }
  }
}
