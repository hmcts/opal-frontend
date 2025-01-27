import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-govuk-pagination',

  imports: [CommonModule],
  templateUrl: './govuk-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukPaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() limit = 25;
  @Output() changePage = new EventEmitter<number>();

  public pages = signal<number[]>([]);
  public elipsedPages = signal<(number | string)[]>([]);
  public ELIPSIS = '...';

  /**
   * Lifecycle hook that is called when any data-bound property of the component changes.
   * It recalculates the pages for pagination.
   */
  ngOnChanges(): void {
    this.calculatePages();
  }

  /**
   * Handles the page change event.
   *
   * @param $event - The click event that triggered the page change.
   * @param page - The new page number.
   */
  onPageChanged($event: MouseEvent, page: number) {
    $event.preventDefault();
    this.changePage.emit(page);
  }

  /**
   * Calculates the number of pages based on the total number of items and the limit per page.
   * Updates the `pages` and `elipsedPages` properties accordingly.
   */
  private calculatePages() {
    const pagesCount = Math.ceil(this.total / this.limit);
    this.pages.set(this.range(1, pagesCount));
    this.elipsedPages.set(this.elipseSkippedPages(this.pages(), this.currentPage));
  }

  /**
   * Generates an array of numbers within a specified range.
   * @param start The starting number of the range.
   * @param end The ending number of the range.
   * @returns An array of numbers within the specified range.
   */
  private range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }

  /**
   * Inserts ellipses into the given array of pages based on the current page number.
   * @param pages - The array of pages.
   * @param currentPage - The current page number.
   * @returns The modified array of pages with ellipses inserted.
   */
  private elipseSkippedPages(pages: (string | number)[], currentPage: number): (string | number)[] {
    pages = [...pages];

    if (currentPage < pages.length - 2) {
      // Add elipses to the right of current page
      pages.splice(currentPage + 1, pages.length - currentPage - 2, this.ELIPSIS);
    }

    if (currentPage >= 5) {
      // Add elipses to the left of current page
      pages.splice(1, currentPage - 3, this.ELIPSIS);
    }

    return pages;
  }
}
