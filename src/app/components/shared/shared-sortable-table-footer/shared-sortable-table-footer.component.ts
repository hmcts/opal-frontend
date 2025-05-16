import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MojSortableTableStatusComponent } from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { GovukPaginationComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-pagination';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';

@Component({
  selector: 'app-shared-sortable-table-footer',
  imports: [CommonModule, MojSortableTableStatusComponent, GovukPaginationComponent],
  templateUrl: './shared-sortable-table-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSortableTableFooterComponent extends AbstractSortableTablePaginationComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) set abstractTableData(abstractTableData: any[]) {
    this.abstractTableDataSignal.set(abstractTableData);
  }

  @Input({ required: true }) set itemsPerPage(itemsPerPage: number) {
    this.itemsPerPageSignal.set(itemsPerPage);
  }

  @Input({ required: true }) set currentPage(currentPage: number) {
    this.currentPageSignal.set(currentPage);
  }

  @Output() changePage = new EventEmitter<number>();

  /**
   * Handles the page change event by invoking the parent class's `onPageChange` method
   * and emitting the `changePage` event with the new page number.
   *
   * @param newPage - The number of the new page to navigate to.
   */
  public override onPageChange(newPage: number): void {
    super.onPageChange(newPage);
    this.changePage.emit(newPage);
  }
}
