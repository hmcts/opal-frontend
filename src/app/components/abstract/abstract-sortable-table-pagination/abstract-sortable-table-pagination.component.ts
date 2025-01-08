import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractSortableTableComponent } from '../abstract-sortable-table/abstract-sortable-table.component';
import { SortableValues } from '@services/sort-service/types/sort-service-type';
import { IAbstractTableData } from '../abstract-sortable-table/interfaces/abstract-sortable-table-interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractSortableTablePaginationComponent
  extends AbstractSortableTableComponent
  implements OnInit, OnDestroy
{
  public abstractPaginatedCurrentPage = signal(1);
  public abstractPaginatedItemsPerPage = signal(0);
  public abstractPaginatedStartIndex = signal(0);
  public abstractPaginatedEndIndex = signal(0);
  public abstractPaginatedData: IAbstractTableData<SortableValues>[] | null = null;

  private readonly ngUnsubscribe$ = new Subject<void>();

  /**
   * Sets up the listener for changes in the sort state.
   */
  private setupSortStateListener(): void {
    this.abstractSortState.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.updatePaginatedData();
    });
  }

  /**
   * Calculates start and end indices for the current page and updates paginated data.
   */
  private calculatePaginationIndices(): { startIndex: number; endIndex: number } {
    const currentPage = this.abstractPaginatedCurrentPage();
    const itemsPerPage = this.abstractPaginatedItemsPerPage();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return { startIndex, endIndex };
  }

  /**
   * Updates paginated data based on the current page and items per page.
   */
  public updatePaginatedData(): void {
    const { startIndex, endIndex } = this.calculatePaginationIndices();
    const dataLength = this.abstractTableData?.length ?? 0;

    this.abstractPaginatedStartIndex.set(startIndex + 1);
    this.abstractPaginatedEndIndex.set(Math.min(endIndex, dataLength));
    this.abstractPaginatedData = this.abstractTableData?.slice(startIndex, endIndex) ?? [];
  }

  /**
   * Updates the current page and recalculates paginated data.
   * @param newPage - The new page number.
   */
  public onPageChange(newPage: number): void {
    this.abstractPaginatedCurrentPage.set(newPage);
    this.updatePaginatedData();
  }

  /**
   * Initializes the component, setting up subscriptions and initial data.
   */
  public override ngOnInit(): void {
    super.ngOnInit();
    this.setupSortStateListener();
    this.updatePaginatedData();
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
