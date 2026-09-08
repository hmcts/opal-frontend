import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractSortableTablePaginationComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table-pagination';
import { CustomDeferredLiveRegionAnnouncement } from '@hmcts/opal-frontend-common/components/custom/custom-deferred-live-region-announcement';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  MojSortableTableComponent,
  MojSortableTableHeaderComponent,
  MojSortableTableRowComponent,
  MojSortableTableRowDataComponent,
  MojSortableTableStatusComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { MojPaginationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-pagination';
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
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT } from './constants/fines-api-process-files-table-wrapper-content.constant';
import { IFinesApiProcessFilesTableWrapperTableData } from './interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { IFinesApiProcessFilesTableWrapperTableSort } from './interfaces/fines-api-process-files-table-wrapper-table-sort.interface';

@Component({
  selector: 'app-fines-api-process-files-table-wrapper',
  imports: [
    CustomDeferredLiveRegionAnnouncement,
    CustomHorizontalScrollPaneComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojMultiSelectBodyDirective,
    MojMultiSelectHeadDirective,
    MojPaginationComponent,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
  ],
  templateUrl: './fines-api-process-files-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiProcessFilesTableWrapperComponent extends AbstractSortableTablePaginationComponent {
  private readonly MAX_RESULTS = 500;
  private readonly selectedRowIdsSignal = signal<Set<string>>(new Set<string>());
  private readonly rowControls = new Map<string, FormControl<boolean>>();

  public readonly selectAllControl = new FormControl<boolean>(false, { nonNullable: true });
  public override itemsPerPageSignal = signal(25);
  public readonly content = FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT;
  public override paginatedTableDataComputed = computed(() => {
    const data = this.sortedTableDataSignal() as IFinesApiProcessFilesTableWrapperTableData[];
    return data.slice(this.startIndexComputed() - 1, this.endIndexComputed());
  });
  public readonly fullTableDataComputed = computed(
    () => this.sortedTableDataSignal() as IFinesApiProcessFilesTableWrapperTableData[],
  );
  public readonly selectedFilesCountComputed = computed(() => this.selectedRowIdsSignal().size);
  public readonly totalFilesCountComputed = computed(() => this.fullTableDataComputed().length);
  public readonly selectedFilesHintComputed = computed(() =>
    this.content.selectedFiles(this.selectedFilesCountComputed(), this.totalFilesCountComputed()),
  );
  public readonly processFilesAnnouncement = this.content.announcement;

  @Output() public readonly selectedInterfaceFileIdsChange = new EventEmitter<string[]>();

  /** Associates the select-all fieldset with validation rendered by the parent screen. */
  @Input() public selectionErrorId: string | null = null;

  /**
   * Sets the latest mapped table rows, retaining the active user sort and valid selections.
   */
  @Input({ required: true }) set tableData(tableData: IFinesApiProcessFilesTableWrapperTableData[]) {
    this.setTableData(tableData.slice(0, this.MAX_RESULTS));
    this.onApplyFilters();
    this.pruneMissingSelections(true);
  }

  /**
   * Applies an externally persisted sort state.
   */
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesApiProcessFilesTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  /**
   * Restores selected interface file IDs held by the parent flow store.
   */
  @Input({ required: false }) set selectedInterfaceFileIds(selectedInterfaceFileIds: string[] | null) {
    this.selectedRowIdsSignal.set(new Set(selectedInterfaceFileIds ?? []));
    this.pruneMissingSelections(false);
  }

  /**
   * Emits selected IDs in the API-provided row order rather than the current visual sort order.
   */
  private emitSelectedInterfaceFileIds(): void {
    const selectedRowIds = this.selectedRowIdsSignal();
    const selectedIds = (this.displayTableDataSignal() as IFinesApiProcessFilesTableWrapperTableData[])
      .filter((row) => selectedRowIds.has(this.getRowIdentifier(row)))
      .map((row) => this.getRowIdentifier(row));

    this.selectedInterfaceFileIdsChange.emit(selectedIds);
  }

  /**
   * Synchronises row and header checkbox controls with the selected ID set.
   */
  private syncSelectionControls(): void {
    const currentRows = this.fullTableDataComputed();
    const currentRowIds = new Set(currentRows.map((row) => this.getRowIdentifier(row)));

    currentRows.forEach((row) => {
      const rowId = this.getRowIdentifier(row);
      const selected = this.selectedRowIdsSignal().has(rowId);
      const control = this.rowControls.get(rowId);

      if (control && control.value !== selected) {
        control.setValue(selected, { emitEvent: false });
      }
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
   * Removes selections that no longer exist after the table data changes.
   */
  private pruneMissingSelections(emitChange: boolean): void {
    const currentSelection = this.selectedRowIdsSignal();
    const validRowIds = new Set(this.fullTableDataComputed().map((row) => this.getRowIdentifier(row)));
    const nextSelection = new Set([...currentSelection].filter((rowId) => validRowIds.has(rowId)));
    const selectionChanged = nextSelection.size !== currentSelection.size;

    this.selectedRowIdsSignal.set(nextSelection);
    this.syncSelectionControls();

    if (emitChange && selectionChanged) {
      this.emitSelectedInterfaceFileIds();
    }
  }

  /**
   * Returns the stable interface file identifier used for row selection.
   */
  public getRowIdentifier(row: IFinesApiProcessFilesTableWrapperTableData): string {
    return row.interfaceFileId;
  }

  /**
   * Builds a safe, stable DOM id for the row checkbox.
   */
  public getRowDomId(row: IFinesApiProcessFilesTableWrapperTableData): string {
    return `fines-api-process-file-${this.getRowIdentifier(row).replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`;
  }

  /**
   * Gets or creates the checkbox control associated with a table row.
   */
  public getRowControl(row: IFinesApiProcessFilesTableWrapperTableData): FormControl<boolean> {
    const rowId = this.getRowIdentifier(row);
    const selected = this.selectedRowIdsSignal().has(rowId);
    const existingControl = this.rowControls.get(rowId);

    if (existingControl) {
      if (existingControl.value !== selected) {
        existingControl.setValue(selected, { emitEvent: false });
      }
      return existingControl;
    }

    const control = new FormControl<boolean>(selected, { nonNullable: true });
    this.rowControls.set(rowId, control);
    return control;
  }

  /**
   * Returns whether the supplied row is selected.
   */
  public isRowSelected(row: IFinesApiProcessFilesTableWrapperTableData, index: number): boolean {
    return isMultiSelectRowSelected(row, index, this.selectedRowIdsSignal(), this.getRowIdentifier);
  }

  /**
   * Returns whether every file in the complete dataset is selected.
   */
  public allRowsSelected(): boolean {
    return areAllMultiSelectRowsSelected(
      this.fullTableDataComputed(),
      this.selectedRowIdsSignal(),
      this.getRowIdentifier,
    );
  }

  /**
   * Returns whether some, but not all, files in the complete dataset are selected.
   */
  public someRowsSelected(): boolean {
    return areSomeMultiSelectRowsSelected(
      this.fullTableDataComputed(),
      this.selectedRowIdsSignal(),
      this.getRowIdentifier,
    );
  }

  /**
   * Selects or clears every file across all pages.
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
    this.syncSelectionControls();
    this.emitSelectedInterfaceFileIds();
  }

  /**
   * Updates selection for one file and emits the complete selected ID list.
   */
  public onRowSelectionChange(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const rowId = event.rowId.toString();

    if (!this.fullTableDataComputed().some((row) => this.getRowIdentifier(row) === rowId)) {
      return;
    }

    this.selectedRowIdsSignal.set(
      toggleMultiSelectRow(this.selectedRowIdsSignal(), rowId, event.checked) as Set<string>,
    );
    this.syncSelectionControls();
    this.emitSelectedInterfaceFileIds();
  }
}
