import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';

@Component({
  selector: 'app-fines-sa-results-shared-pagination',
  imports: [CommonModule, MojPaginationComponent],
  template: `
    @if (totalItems > currentPageItems) {
      <opal-lib-moj-pagination
        [id]="paginationId"
        [currentPage]="currentPage"
        [limit]="itemsPerPage"
        [total]="totalItems"
        (changePage)="onPageChange($event)"
      ></opal-lib-moj-pagination>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaResultsSharedPaginationComponent {
  @Input({ required: true }) paginationId: string = 'fines-draft-table-pagination';
  @Input({ required: true }) currentPage: number = 1;
  @Input({ required: true }) itemsPerPage: number = 25;
  @Input({ required: true }) totalItems: number = 0;
  @Input({ required: true }) currentPageItems: number = 0;

  @Output() changePage = new EventEmitter<number>();

  protected onPageChange(page: number): void {
    this.changePage.emit(page);
  }
}
