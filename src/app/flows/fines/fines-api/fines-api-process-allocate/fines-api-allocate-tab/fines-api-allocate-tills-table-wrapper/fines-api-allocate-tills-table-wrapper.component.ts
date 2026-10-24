import { ChangeDetectionStrategy, Component, inject, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';
import { FinesApiSelectableTableComponent } from '../../../fines-api-selectable-table/fines-api-selectable-table.component';
import { IFinesApiSelectableTableColumn } from '../../../fines-api-selectable-table/interfaces/fines-api-selectable-table-column.interface';
import { FINES_ROUTING_PATHS } from '../../../../routing/constants/fines-routing-paths.constant';
import { FINES_API_ROUTING_PATHS } from '../../../routing/constants/fines-api-routing-paths.constant';
import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT } from './constants/fines-api-allocate-tills-table-wrapper-content.constant';
import { IFinesApiAllocateTillsTableWrapperTableData } from './interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';
import { FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-api-allocate-tills-table-wrapper-table-sort-default.constant';
import { FinesApiStore } from '../../../stores/fines-api.store';

@Component({
  selector: 'app-fines-api-allocate-tills-table-wrapper',
  imports: [FinesApiSelectableTableComponent, RouterLink, CustomAccessibleMonetaryComponent],
  templateUrl: './fines-api-allocate-tills-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiAllocateTillsTableWrapperComponent {
  protected readonly finesApiStore = inject(FinesApiStore);
  protected readonly rows = signal<IFinesApiAllocateTillsTableWrapperTableData[]>([]);
  protected readonly defaultSort = FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
  protected readonly content = {
    ...FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT,
    id: 'fines-api-allocate-tills',
    selectAllId: 'fines-api-allocate-select-all',
    selectionLegend: FINES_API_ALLOCATE_TILLS_TABLE_WRAPPER_CONTENT.selectAll,
    descriptionId: 'fines-api-allocate-hint',
    selectedCountId: 'fines-api-allocate-selected-count',
    selectionCellSuffix: 'cell-1',
  };
  protected readonly columns: IFinesApiSelectableTableColumn[] = Object.values(this.content.columns).map(
    (key, index) => ({
      key,
      idSuffix: `cell-${index + 2}`,
      numeric: key === this.content.columns.amount,
    }),
  );
  protected readonly tillSummaryRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.root}/${FINES_API_ROUTING_PATHS.children.tillSummary}`;
  /**
   * Returns the stable till identifier used for selection.
   *
   * @param row The mapped till row.
   * @returns The internal till ID.
   */
  protected readonly getRowId = (row: IFinesApiAllocateTillsTableWrapperTableData): string => row.tillId;
  /**
   * Builds the checkbox DOM ID for a till row.
   *
   * @param row The mapped till row.
   * @returns The flow-specific checkbox ID.
   */
  protected readonly getRowDomId = (row: IFinesApiAllocateTillsTableWrapperTableData): string =>
    `fines-api-allocate-till-${row.tillId}`;
  /**
   * Builds a table cell DOM ID for a till row.
   *
   * @param row The mapped till row.
   * @param suffix The column or selection-cell suffix.
   * @returns The flow-specific cell ID.
   */
  protected readonly getCellId = (row: IFinesApiAllocateTillsTableWrapperTableData, suffix: string): string =>
    `fines-api-allocate-${row.tillId}-${suffix}`;
  /**
   * Builds the accessible checkbox label for a till row.
   *
   * @param row The mapped till row.
   * @returns The label identifying the row to assistive technology.
   */
  protected readonly rowLabel = (row: IFinesApiAllocateTillsTableWrapperTableData): string =>
    this.content.selectTill(row[this.content.columns.tillNumber], row[this.content.columns.businessUnit]);

  /**
   * Replaces table rows and clears selection, including responses with the same IDs.
   *
   * @param rows All mapped tills in the order supplied by the backend.
   * @returns Nothing; replaces rows and resets the selection.
   */
  @Input({ required: true }) public set tableData(rows: IFinesApiAllocateTillsTableWrapperTableData[]) {
    this.rows.set(rows);
    this.clearSelection();
  }

  /**
   * Clears selection immediately on refresh, even if the request subsequently fails.
   *
   * @returns Nothing; supplies an empty selection to the shared table.
   */
  public clearSelection(): void {
    this.finesApiStore.setSelectedTillIds([]);
  }

  /** Stores the selected till IDs so shared navigation guards can protect the selection. */
  protected updateSelection(selectedIds: string[]): void {
    this.finesApiStore.setSelectedTillIds(selectedIds);
  }
}
