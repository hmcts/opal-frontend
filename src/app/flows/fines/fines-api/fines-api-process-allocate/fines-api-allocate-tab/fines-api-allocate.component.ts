import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SortDirectionType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import {
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { FINES_API_ALLOCATE_CONTENT } from './constants/fines-api-allocate-content.constant';
import { IFinesApiAllocateData, IFinesApiAllocateTillRow } from './interfaces/fines-api-allocate-data.interface';
import { FINES_ROUTING_PATHS } from '../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../../routing/constants/fines-api-routing-paths.constant';

@Component({
  selector: 'app-fines-api-allocate',
  imports: [
    RouterLink,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    CustomHorizontalScrollPaneComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertIconComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-api-allocate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateComponent {
  private readonly dateService = inject(DateService);
  private readonly selectedIds = signal(new Set<string>());
  protected readonly sortColumn = signal('');
  protected readonly sortDirection = signal<SortDirectionType>('none');
  protected readonly sortedTills = computed(() => {
    const key = this.sortColumn();
    if (!key) return this.data().tills;
    const direction = this.sortDirection() === 'ascending' ? 1 : -1;
    return this.data()
      .tills.map((row) => ({ row, value: this.sortValue(row, key) }))
      .sort((left, right) => {
        if (left.value === null) return right.value === null ? 0 : 1;
        if (right.value === null) return -1;
        const comparison =
          typeof left.value === 'string' && typeof right.value === 'string'
            ? left.value.localeCompare(right.value, 'en-GB', { numeric: true, sensitivity: 'base' })
            : left.value < right.value
              ? -1
              : left.value > right.value
                ? 1
                : 0;
        return comparison * direction;
      })
      .map(({ row }) => row);
  });

  protected readonly data = signal<IFinesApiAllocateData>({
    processingTotal: 0,
    processingByBusinessUnit: [],
    tills: [],
  });
  protected readonly content = FINES_API_ALLOCATE_CONTENT;
  protected readonly tillSummaryRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.children.tillSummary}`;
  protected readonly rowControls = new Map<string, FormControl<boolean>>();
  protected readonly selectAllControl = new FormControl(false, { nonNullable: true });
  protected readonly selectedCount = computed(() => this.selectedIds().size);
  protected readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.data().tills.length,
  );
  protected readonly processingAnnouncement = computed(() =>
    [
      this.content.processingTotal(this.data().processingTotal),
      ...this.data().processingByBusinessUnit.map((unit) => `${unit.businessUnitName} (${unit.count})`),
    ].join(' '),
  );

  /**
   * Replaces the tab data and rebuilds checkbox controls, clearing selection even when till IDs are unchanged.
   * Retains the current sort column and direction for the replacement rows.
   */
  @Input({ required: true }) public set tabData(value: IFinesApiAllocateData) {
    this.data.set(value);
    this.rowControls.clear();
    value.tills.forEach((row) => this.rowControls.set(row.tillId, new FormControl(false, { nonNullable: true })));
    this.clearSelection();
  }

  @Output() public readonly refreshRequested = new EventEmitter<void>();

  /**
   * Converts a displayed column value into a comparable value, preserving monetary precision with bigint pennies.
   * Returns null for unavailable or invalid numeric/date values so they sort after populated values.
   *
   * @param row The mapped till row to read.
   * @param column The sortable column heading.
   * @returns Text, a numeric value, or null when no sortable value is available.
   */
  private sortValue(row: IFinesApiAllocateTillRow, column: string): string | number | bigint | null {
    switch (column) {
      case 'Till number':
        return row.tillNumber;
      case 'Errors':
        return /^\d+$/.test(row.errorsDisplay) ? BigInt(row.errorsDisplay) : null;
      case 'Filename':
        return row.fileName === '—' ? null : row.fileName;
      case 'Source':
        return row.sourceLabel === '—' ? null : row.sourceLabel;
      case 'Amount': {
        const pennies = row.amountDisplay.replace(/[£,.]/g, '');
        return /^-?\d+$/.test(pennies) ? BigInt(pennies) : null;
      }
      case 'Business Unit':
        return row.businessUnitName;
      case 'Processed by':
        return row.processedByDisplay;
      case 'Date processed': {
        const date = this.dateService.getFromFormat(row.dateProcessedDisplay, "dd MMMM yyyy 'at' HH:mm");
        return date.isValid ? date.toMillis() : null;
      }
      default:
        return null;
    }
  }

  /**
   * Synchronises row and select-all checkbox controls with the selected till IDs without emitting form events.
   */
  private syncControls(): void {
    this.rowControls.forEach((control, id) => control.setValue(this.selectedIds().has(id), { emitEvent: false }));
    this.selectAllControl.setValue(this.data().tills.length > 0 && this.selectedCount() === this.data().tills.length, {
      emitEvent: false,
    });
  }

  /**
   * Clears all selected till IDs and updates the row and select-all checkbox controls.
   */
  private clearSelection(): void {
    this.selectedIds.set(new Set());
    this.syncControls();
  }

  /**
   * Updates the active sort and its accessible announcement while preserving selections by till ID.
   *
   * @param event The column heading and direction emitted by the sortable table header.
   */
  protected onSortChange(event: { key: string; sortType: 'ascending' | 'descending' }): void {
    this.sortColumn.set(event.key);
    this.sortDirection.set(event.sortType);
  }

  /**
   * Selects or clears every till in the current dataset, independently of the displayed sort order.
   *
   * @param checked Whether all tills should be selected.
   */
  protected toggleAll(checked: boolean): void {
    this.selectedIds.set(new Set(checked ? this.data().tills.map((row) => row.tillId) : []));
    this.syncControls();
  }

  /**
   * Updates selection for a single till and synchronises the header checkbox, ignoring unknown row IDs.
   *
   * @param event The stable till ID and requested checkbox state.
   */
  protected toggleRow(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const id = String(event.rowId);
    if (!this.rowControls.has(id)) {
      return;
    }
    this.selectedIds.set(toggleMultiSelectRow(this.selectedIds(), id, event.checked));
    this.syncControls();
  }

  /**
   * Clears selections before asking the parent component to refresh the tab data.
   */
  protected refresh(): void {
    this.clearSelection();
    this.refreshRequested.emit();
  }
}
