import { ChangeDetectionStrategy, Component, computed, Input, signal } from '@angular/core';
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';
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
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { FINES_ROUTING_PATHS } from '../../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../../../routing/constants/fines-api-routing-paths.constant';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT } from './constants/fines-api-allocate-tills-table-wrapper-content.constant';
import { IFinesApiAllocateTillsTableWrapperTableData } from './interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';
import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-api-allocate-tills-table-wrapper-table-sort-default.constant';

@Component({
  selector: 'app-fines-api-allocate-tills-table-wrapper',
  imports: [
    RouterLink,
    CustomAccessibleMonetaryComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    CustomHorizontalScrollPaneComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
  ],
  templateUrl: './fines-api-allocate-tills-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateTillsTableWrapperComponent extends AbstractSortableTableComponent {
  private readonly selectedIds = signal(new Set<string>());
  protected readonly content = FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT;
  protected readonly columns = Object.values(this.content.columns);
  protected readonly tillSummaryRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.children.tillSummary}`;
  protected readonly rowControls = new Map<string, FormControl<boolean>>();
  protected readonly selectAllControl = new FormControl(false, { nonNullable: true });
  protected readonly fullTableDataComputed = computed(
    () => this.sortedTableDataSignal() as IFinesApiAllocateTillsTableWrapperTableData[],
  );
  protected readonly selectedCount = computed(() => this.selectedIds().size);
  protected readonly someSelected = computed(
    () => this.selectedCount() > 0 && this.selectedCount() < this.fullTableDataComputed().length,
  );

  /**
   * Replaces the table rows, restores backend order and rebuilds unchecked row controls.
   *
   * @param rows All available tills in the order supplied by the backend.
   */
  @Input({ required: true }) public set tableData(rows: IFinesApiAllocateTillsTableWrapperTableData[]) {
    this.setTableData(rows);
    this.sortStateSignal.set({ ...FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_TABLE_SORT_DEFAULT });
    this.sortedColumnTitleSignal.set('');
    this.sortedColumnDirectionSignal.set('none');
    this.onApplyFilters();
    this.rowControls.clear();
    rows.forEach((row) => this.rowControls.set(row.tillId, new FormControl(false, { nonNullable: true })));
    this.clearSelection();
  }

  /**
   * Synchronises row and select-all controls from the current selected IDs without emitting form events.
   *
   * @returns Nothing; updates the existing checkbox controls.
   */
  private syncControls(): void {
    this.rowControls.forEach((control, id) => control.setValue(this.selectedIds().has(id), { emitEvent: false }));
    this.selectAllControl.setValue(
      this.fullTableDataComputed().length > 0 && this.selectedCount() === this.fullTableDataComputed().length,
      {
        emitEvent: false,
      },
    );
  }

  /**
   * Selects or clears every till in the current dataset, independently of the displayed sort order.
   *
   * @param checked Whether all tills should be selected; false clears the selection.
   * @returns Nothing; updates selected IDs and synchronises checkbox controls.
   */
  protected toggleAll(checked: boolean): void {
    this.selectedIds.set(new Set(checked ? this.fullTableDataComputed().map((row) => row.tillId) : []));
    this.syncControls();
  }

  /**
   * Updates selection for a single till and synchronises the header checkbox, ignoring unknown row IDs.
   *
   * @param event The stable till ID and requested checkbox state.
   * @returns Nothing; updates selection for a known ID and ignores unknown IDs.
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
   * Clears all selected till IDs and updates the row and select-all checkbox controls.
   *
   * @returns Nothing; resets selection and checkbox state.
   */
  public clearSelection(): void {
    this.selectedIds.set(new Set());
    this.syncControls();
  }
}
