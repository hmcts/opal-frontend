import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../../routing/constants/fines-api-routing-paths.constant';
import { FINES_API_IGNORED_CONTENT } from './constants/fines-api-ignored-content.constant';
import { IFinesApiIgnoredData } from './interfaces/fines-api-ignored-data.interface';

type IgnoredColumn = (typeof FINES_API_IGNORED_CONTENT.columns)[number];

@Component({
  selector: 'app-fines-api-ignored',
  imports: [
    RouterLink,
    CustomHorizontalScrollPaneComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
  ],
  templateUrl: './fines-api-ignored.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiIgnoredComponent {
  private readonly collator = new Intl.Collator('en-GB', { numeric: true, sensitivity: 'base' });

  protected readonly content = FINES_API_IGNORED_CONTENT;
  protected readonly fileSummaryRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.children.fileSummary}`;
  protected readonly sort = signal<{ key: IgnoredColumn; sortType: 'ascending' | 'descending' } | null>(null);
  protected readonly rows = computed(() => {
    const rows = this.tabData()?.rows ?? [];
    const sort = this.sort();
    if (!sort) return rows;
    return [...rows].sort((left, right) => {
      const a = left[sort.key];
      const b = right[sort.key];
      const comparison =
        typeof a === 'number' && typeof b === 'number' ? a - b : this.collator.compare(String(a), String(b));
      return sort.sortType === 'ascending' ? comparison : -comparison;
    });
  });

  public readonly tabData = input<IFinesApiIgnoredData | null>(null);
  public readonly refreshRequested = output<void>();

  /**
   * Sorts the displayed rows by a recognised column without mutating the backend response.
   *
   * @param event Selected column key and ascending or descending sort direction.
   * @returns Nothing; updates the sort signal for recognised columns and ignores unknown keys.
   */
  protected onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    const key = this.content.columns.find((column) => column === event.key);
    if (key) this.sort.set({ key, sortType: event.sortType });
  }

  /**
   * Restores backend row order and requests fresh ignored-file data from the parent.
   *
   * @returns Nothing; clears sorting immediately and emits a refresh request, even if the read later fails.
   */
  protected refresh(): void {
    this.sort.set(null);
    this.refreshRequested.emit();
  }
}
