import { DOCUMENT } from '@angular/common';
import { computed, inject } from '@angular/core';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

export abstract class AbstractSortableTablePaginationAccessibilityComponent extends AbstractSortableTablePaginationComponent {
  protected readonly utilsService = inject(UtilsService);
  protected readonly document = inject(DOCUMENT);
  public readonly paginationStatusMessageComputed = computed(() => `Page ${this.currentPageSignal()} loaded`);

  public abstract readonly paginationTopElementId: string;

  public override onPageChange(newPage: number): void {
    super.onPageChange(newPage);
    this.utilsService.scrollToTop();
    this.document.getElementById(this.paginationTopElementId)?.focus();
  }
}
