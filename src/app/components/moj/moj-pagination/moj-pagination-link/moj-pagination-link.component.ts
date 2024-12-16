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
