import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() limit = 25;
  @Output() changePage = new EventEmitter<number>();

  public pages = signal<number[]>([]);
  public elipsedPages = signal<(number | string)[]>([]);
  public ELIPSIS = '...';

  ngOnChanges(): void {
    this.calculatePages();
  }

  onPageChanged($event: MouseEvent, page: number) {
    $event.preventDefault();
    this.changePage.emit(page);
  }

  private calculatePages() {
    const pagesCount = Math.ceil(this.total / this.limit);
    this.pages.set(this.range(1, pagesCount));
    this.elipsedPages.set(this.elipseSkippedPages(this.pages(), this.currentPage));
  }

  private range(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }

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

    return [...pages];
  }
}
