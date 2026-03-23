import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { CustomHorizontalScrollPaneComponent } from '@hmcts/opal-frontend-common/components/custom/custom-horizontal-scroll-pane';
import {
  GovukCheckboxesComponent,
  GovukCheckboxesItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import { MojAlertIconComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
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
import { DateFormatPipe } from '@hmcts/opal-frontend-common/pipes/date-format';
import { NationalInsurancePipe } from '@hmcts/opal-frontend-common/pipes/national-insurance';
import { FinesNotProvidedComponent } from '@app/flows/fines/components/fines-not-provided/fines-not-provided.component';
import { IFinesConSearchResultAccountCheck } from '../interfaces/fines-con-search-result-account-check.interface';
import { IFinesConSearchResultDefendantTableWrapperTableData } from './interfaces/fines-con-search-result-defendant-table-wrapper-table-data.interface';
import { IFinesConSearchResultDefendantTableWrapperTableSort } from './interfaces/fines-con-search-result-defendant-table-wrapper-table-sort.interface';

@Component({
  selector: 'app-fines-con-search-result-defendant-table-wrapper',
  imports: [
    CommonModule,
    MojSortableTableComponent,
    MojSortableTableHeaderComponent,
    MojSortableTableRowComponent,
    MojSortableTableRowDataComponent,
    MojSortableTableStatusComponent,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojMultiSelectHeadDirective,
    MojMultiSelectBodyDirective,
    DateFormatPipe,
    NationalInsurancePipe,
    CustomHorizontalScrollPaneComponent,
    FinesNotProvidedComponent,
    MojAlertIconComponent,
  ],
  templateUrl: './fines-con-search-result-defendant-table-wrapper.component.html',
  styleUrls: ['./fines-con-search-result-defendant-table-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesConSearchResultDefendantTableWrapperComponent extends AbstractSortableTableComponent {
  private readonly selectedRowIdsSignal = signal<Set<MultiSelectRowIdentifier>>(new Set<MultiSelectRowIdentifier>());
  private readonly checksByAccountIdSignal = signal<Record<number, IFinesConSearchResultAccountCheck[]>>({});
  private readonly rowControls = new Map<MultiSelectRowIdentifier, FormControl<boolean>>();
  protected readonly DATE_INPUT_FORMAT = 'yyyy-MM-dd';
  protected readonly DATE_OUTPUT_FORMAT = 'dd MMM yyyy';
  public readonly selectAllControl = new FormControl<boolean>(false, { nonNullable: true });
  public readonly checkSeverities: ReadonlyArray<IFinesConSearchResultAccountCheck['severity']> = ['error', 'warning'];
  public readonly hasSelectableRowsComputed = computed(() => this.getSelectableRows().length > 0);

  public readonly sortedTableDataComputed = computed(
    () => this.sortedTableDataSignal() as IFinesConSearchResultDefendantTableWrapperTableData[],
  );
  public readonly selectedAccountsCountComputed = computed(() => this.selectedRowIdsSignal().size);
  public readonly totalAccountsCountComputed = computed(() => this.sortedTableDataComputed().length);
  public readonly selectedAccountsHintComputed = computed(() => {
    return `${this.selectedAccountsCountComputed()} to ${this.totalAccountsCountComputed()} accounts selected`;
  });

  /**
   * Sets incoming table rows and reconciles current selection.
   *
   * @param tableData - Latest table rows.
   */
  @Input({ required: true }) set tableData(tableData: IFinesConSearchResultDefendantTableWrapperTableData[]) {
    this.setTableData(tableData);
    this.pruneUnselectableSelections();
  }

  /**
   * Sets account checks map and reconciles current selection.
   *
   * @param checksByAccountId - Validation checks keyed by account id.
   */
  @Input() set checksByAccountId(checksByAccountId: Record<number, IFinesConSearchResultAccountCheck[]> | null) {
    this.checksByAccountIdSignal.set(checksByAccountId ?? {});
    this.pruneUnselectableSelections();
  }

  /**
   * Applies external table sort state.
   *
   * @param existingSortState - Current persisted sort state.
   */
  @Input({ required: true }) set existingSortState(
    existingSortState: IFinesConSearchResultDefendantTableWrapperTableSort | null,
  ) {
    this.abstractExistingSortState = existingSortState;
  }

  @Output() public accountIdClicked = new EventEmitter<number>();
  @Output() public addToList = new EventEmitter<number[]>();

  /**
   * Synchronises row and header checkbox controls with current selection state.
   */
  private syncSelectionControls(): void {
    const currentRows = this.sortedTableDataComputed();
    const currentRowIds = new Set<MultiSelectRowIdentifier>();

    currentRows.forEach((row, index) => {
      const rowId = this.getRowIdentifier(row, index);
      currentRowIds.add(rowId);

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

    const allSelected = this.allVisibleRowsSelected();
    if (this.selectAllControl.value !== allSelected) {
      this.selectAllControl.setValue(allSelected, { emitEvent: false });
    }
  }

  /**
   * Emits selected account id for parent-level navigation handling.
   *
   * @param accountID - Account id to emit.
   */
  public goToAccount(accountID: number): void {
    this.accountIdClicked.emit(accountID);
  }

  /**
   * Resolves a stable row identifier for multi-select operations.
   *
   * @param row - Table row data.
   * @param index - Row index fallback.
   * @returns Stable row identifier.
   */
  public getRowIdentifier(
    row: IFinesConSearchResultDefendantTableWrapperTableData,
    index: number,
  ): MultiSelectRowIdentifier {
    return (row['Account ID'] as MultiSelectRowIdentifier) ?? (row['Account'] as MultiSelectRowIdentifier) ?? index;
  }

  /**
   * Builds a sanitised DOM id for a row using the supplied prefix.
   *
   * @param row - Table row data.
   * @param index - Row index fallback.
   * @param prefix - Id prefix used by the caller context.
   * @returns Sanitised row id with prefix.
   */
  public getRowDomId(row: IFinesConSearchResultDefendantTableWrapperTableData, index: number, prefix: string): string {
    const raw = String(this.getRowIdentifier(row, index));
    return `${prefix}-${raw.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`;
  }

  /**
   * Gets or creates checkbox control for a row.
   *
   * @param row - Table row data.
   * @param index - Row index fallback.
   * @returns Checkbox form control for row selection.
   */
  public getRowControl(row: IFinesConSearchResultDefendantTableWrapperTableData, index: number): FormControl<boolean> {
    const rowId = this.getRowIdentifier(row, index);
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
   * Checks whether the row is selected.
   *
   * @param row - Table row data.
   * @param index - Row index.
   * @returns `true` when selected.
   */
  public isRowSelected(row: IFinesConSearchResultDefendantTableWrapperTableData, index: number): boolean {
    return isMultiSelectRowSelected(row, index, this.selectedRowIdsSignal(), this.getRowIdentifier);
  }

  /**
   * Returns checks for a row.
   *
   * @param row - Table row data.
   * @returns Row checks or an empty array.
   */
  public getRowChecks(row: IFinesConSearchResultDefendantTableWrapperTableData): IFinesConSearchResultAccountCheck[] {
    const accountId = row['Account ID'];

    if (accountId === null) {
      return [];
    }

    return this.checksByAccountIdSignal()[accountId] ?? [];
  }

  /**
   * Indicates whether a row has checks.
   *
   * @param row - Table row data.
   * @returns `true` when checks are present.
   */
  public hasRowChecks(row: IFinesConSearchResultDefendantTableWrapperTableData): boolean {
    return this.getRowChecks(row).length > 0;
  }

  /**
   * Returns checks filtered by severity.
   *
   * @param row - Table row data.
   * @param severity - Check severity.
   * @returns Checks matching severity.
   */
  public getChecksBySeverity(
    row: IFinesConSearchResultDefendantTableWrapperTableData,
    severity: IFinesConSearchResultAccountCheck['severity'],
  ): IFinesConSearchResultAccountCheck[] {
    const rowChecks = this.getRowChecks(row);
    const hasErrorChecks = rowChecks.some((check) => check.severity === 'error');

    if (hasErrorChecks && severity === 'warning') {
      return [];
    }

    return rowChecks.filter((check) => check.severity === severity);
  }

  /**
   * Determines whether row can be selected.
   *
   * @param row - Table row data.
   * @returns `true` when row has no error checks.
   */
  public isRowSelectable(row: IFinesConSearchResultDefendantTableWrapperTableData): boolean {
    return !this.getRowChecks(row).some((check) => check.severity === 'error');
  }

  /**
   * Indicates whether all selectable visible rows are selected.
   *
   * @returns `true` when all selectable rows are selected.
   */
  public allVisibleRowsSelected(): boolean {
    const selectableRows = this.getSelectableRows();

    if (selectableRows.length === 0) {
      return false;
    }

    return areAllMultiSelectRowsSelected(selectableRows, this.selectedRowIdsSignal(), this.getRowIdentifier);
  }

  /**
   * Indicates whether some selectable visible rows are selected.
   *
   * @returns `true` when at least one selectable row is selected.
   */
  public someVisibleRowsSelected(): boolean {
    const selectableRows = this.getSelectableRows();

    if (selectableRows.length === 0) {
      return false;
    }

    return areSomeMultiSelectRowsSelected(selectableRows, this.selectedRowIdsSignal(), this.getRowIdentifier);
  }

  /**
   * Toggles selection for all selectable rows.
   *
   * @param checked - Desired checked state.
   */
  public onToggleAll(checked: boolean): void {
    const selectableRows = this.getSelectableRows();

    this.selectedRowIdsSignal.set(
      toggleAllMultiSelectRows(selectableRows, this.selectedRowIdsSignal(), this.getRowIdentifier, checked),
    );
    this.syncSelectionControls();
  }

  /**
   * Handles selection change for a row.
   *
   * @param event - Selection event payload.
   */
  public onRowSelectionChange(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    if (event.checked && !this.isRowIdSelectable(event.rowId)) {
      return;
    }

    this.selectedRowIdsSignal.set(toggleMultiSelectRow(this.selectedRowIdsSignal(), event.rowId, event.checked));
    this.syncSelectionControls();
  }

  /**
   * Emits selected account ids for add-to-list flow.
   */
  public onAddToList(): void {
    const selectedAccountIds = this.sortedTableDataComputed()
      .filter((row, index) => this.selectedRowIdsSignal().has(this.getRowIdentifier(row, index)))
      .map((row) => row['Account ID'])
      .filter((accountId): accountId is number => accountId !== null);

    this.addToList.emit(Array.from(new Set(selectedAccountIds)));
  }

  /**
   * Resolves whether a row id maps to a selectable row.
   *
   * @param rowId - Row identifier.
   * @returns `true` when row is selectable or missing.
   */
  public isRowIdSelectable(rowId: MultiSelectRowIdentifier): boolean {
    const row = this.sortedTableDataComputed().find((item, index) => this.getRowIdentifier(item, index) === rowId);

    if (!row) {
      return true;
    }

    return this.isRowSelectable(row);
  }

  /**
   * Removes selected rows that are no longer selectable.
   */
  public pruneUnselectableSelections(): void {
    const currentSelection = this.selectedRowIdsSignal();
    const nextSelection = new Set<MultiSelectRowIdentifier>();

    this.sortedTableDataComputed().forEach((row, index) => {
      const rowId = this.getRowIdentifier(row, index);

      if (currentSelection.has(rowId) && this.isRowSelectable(row)) {
        nextSelection.add(rowId);
      }
    });

    this.selectedRowIdsSignal.set(nextSelection);
    this.syncSelectionControls();
  }

  /**
   * Returns currently selectable visible rows.
   *
   * @returns Selectable rows collection.
   */
  public getSelectableRows(): IFinesConSearchResultDefendantTableWrapperTableData[] {
    return this.sortedTableDataComputed().filter((row) => this.isRowSelectable(row));
  }

  /**
   * Computes row-level classes for table rendering.
   *
   * @param row - Table row data.
   * @param index - Row index.
   * @returns Space-delimited class names.
   */
  public getMainRowClasses(row: IFinesConSearchResultDefendantTableWrapperTableData, index: number): string {
    const classes: string[] = [];

    if (this.isRowSelected(row, index)) {
      classes.push('govuk-table__row--selected');
    }

    if (this.hasRowChecks(row)) {
      classes.push('defendant-main-row-with-checks');
    }

    return classes.join(' ');
  }
}
