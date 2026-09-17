import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import {
  areAllMultiSelectRowsSelected,
  areSomeMultiSelectRowsSelected,
  isMultiSelectRowSelected,
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT } from './constants/fines-mci-create-allocate-table-content.constant';
import { IFinesMciCreateAllocateTableData } from './interfaces/fines-mci-create-allocate-table-data.interface';
import { IFinesMciCreateAllocateTableSort } from './interfaces/fines-mci-create-allocate-table-sort.interface';

@Component({
  selector: 'app-fines-mci-create-allocate-table',
  imports: [
    CurrencyPipe,
    GovukCheckboxesItemComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
  ],
  templateUrl: './fines-mci-create-allocate-table.component.html',
  styleUrl: './fines-mci-create-allocate-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMciCreateAllocateTableComponent extends AbstractSortableTableComponent {
  private readonly selectedRowIdsSignal = signal<Set<string>>(new Set<string>());
  protected readonly rowControls = new Map<string, FormControl<boolean>>();

  public readonly content = FINES_MCI_CREATE_ALLOCATE_TABLE_CONTENT;
  public readonly selectAllControl = new FormControl<boolean>(false, { nonNullable: true });
  public readonly fullTableDataComputed = computed(
    () => this.sortedTableDataSignal() as IFinesMciCreateAllocateTableData[],
  );
  public readonly selectedTillsCountComputed = computed(() => this.selectedRowIdsSignal().size);
  public readonly totalTillsCountComputed = computed(() => this.fullTableDataComputed().length);
  public readonly selectedTillsHintComputed = computed(() =>
    this.content.selectedTills(this.selectedTillsCountComputed(), this.totalTillsCountComputed()),
  );

  @Input({ required: true }) set tableData(tableData: IFinesMciCreateAllocateTableData[]) {
    this.setTableData(tableData);
    this.syncSelectionControls(tableData);
  }

  @Input({ required: true }) set existingSortState(existingSortState: IFinesMciCreateAllocateTableSort | null) {
    this.abstractExistingSortState = existingSortState;
  }

  /**
   * Synchronises row and header checkbox controls with the selected id set.
   */
  private syncSelectionControls(rows: IFinesMciCreateAllocateTableData[]): void {
    const currentRowIds = new Set(rows.map((row) => this.getRowIdentifier(row)));

    rows.forEach((row) => {
      const rowId = this.getRowIdentifier(row);
      const selected = this.selectedRowIdsSignal().has(rowId);
      const control = this.rowControls.get(rowId);

      if (control) {
        if (control.value !== selected) {
          control.setValue(selected, { emitEvent: false });
        }
        return;
      }

      this.rowControls.set(rowId, new FormControl<boolean>(selected, { nonNullable: true }));
    });

    Array.from(this.rowControls.keys()).forEach((rowId) => {
      if (!currentRowIds.has(rowId)) {
        this.rowControls.delete(rowId);
      }
    });

    const allSelected = this.allRowsSelected();
    if (this.selectAllControl.value !== allSelected) {
      this.selectAllControl.setValue(allSelected, { emitEvent: false });
    }
  }

  /**
   * Returns the stable identifier used for row selection.
   */
  public getRowIdentifier(row: IFinesMciCreateAllocateTableData): string {
    return row.tillId;
  }

  /**
   * Builds a safe, stable DOM id for the row checkbox.
   */
  public getRowDomId(row: IFinesMciCreateAllocateTableData): string {
    return `fines-mci-create-allocate-${this.getRowIdentifier(row).replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`;
  }

  /**
   * Returns whether the supplied row is selected.
   */
  public isRowSelected(row: IFinesMciCreateAllocateTableData, index: number): boolean {
    return isMultiSelectRowSelected(row, index, this.selectedRowIdsSignal(), this.getRowIdentifier);
  }

  /**
   * Returns whether every till in the table is selected.
   */
  public allRowsSelected(): boolean {
    return areAllMultiSelectRowsSelected(
      this.fullTableDataComputed(),
      this.selectedRowIdsSignal(),
      this.getRowIdentifier,
    );
  }

  /**
   * Returns whether some, but not all, tills in the table are selected.
   */
  public someRowsSelected(): boolean {
    return areSomeMultiSelectRowsSelected(
      this.fullTableDataComputed(),
      this.selectedRowIdsSignal(),
      this.getRowIdentifier,
    );
  }

  /**
   * Selects or clears every till.
   */
  public onToggleAll(checked: boolean): void {
    this.selectedRowIdsSignal.set(
      toggleAllMultiSelectRows(
        this.fullTableDataComputed(),
        this.selectedRowIdsSignal(),
        this.getRowIdentifier,
        checked,
      ) as Set<string>,
    );
    this.syncSelectionControls(this.fullTableDataComputed());
  }

  /**
   * Updates selection for one till.
   */
  public onRowSelectionChange(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const rowId = event.rowId.toString();

    if (!this.fullTableDataComputed().some((row) => this.getRowIdentifier(row) === rowId)) {
      return;
    }

    this.selectedRowIdsSignal.set(
      toggleMultiSelectRow(this.selectedRowIdsSignal(), rowId, event.checked) as Set<string>,
    );
    this.syncSelectionControls(this.fullTableDataComputed());
  }
}
