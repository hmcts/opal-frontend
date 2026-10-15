import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
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
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  MultiSelectRowIdentifier,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';
import { NgTemplateOutlet } from '@angular/common';
import {
  IAbstractSortState,
  IAbstractTableData,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/interfaces';
import { SortableValuesType } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table/types';
import { IFinesApiSelectableTableColumn } from './interfaces/fines-api-selectable-table-column.interface';
import { IFinesApiSelectableTableContent } from './interfaces/fines-api-selectable-table-content.interface';
@Component({
  selector: 'app-fines-api-selectable-table',
  imports: [
    NgTemplateOutlet,
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
  templateUrl: './fines-api-selectable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiSelectableTableComponent<T extends IAbstractTableData<SortableValuesType>>
  extends AbstractSortableTablePaginationComponent
  implements OnChanges
{
  private readonly paginationEnabled = signal(false);
  private readonly selectedRowIds = signal(new Set<string>());
  protected readonly rowControls = new Map<string, FormControl<boolean>>();
  public readonly selectAllControl = new FormControl(false, { nonNullable: true });
  public readonly selectedCount = computed(() => this.selectedRowIds().size);
  public readonly fullTableDataComputed = computed(() => this.sortedTableDataSignal() as T[]);
  public readonly visibleRows = computed(() =>
    this.paginationEnabled() ? (this.paginatedTableDataComputed() as T[]) : this.fullTableDataComputed(),
  );
  public readonly allSelected = computed(() =>
    areAllMultiSelectRowsSelected(this.fullTableDataComputed(), this.selectedRowIds(), this.getRowId),
  );
  public readonly someSelected = computed(() =>
    areSomeMultiSelectRowsSelected(this.fullTableDataComputed(), this.selectedRowIds(), this.getRowId),
  );

  @Input({ required: true }) public rows: T[] = [];
  @Input({ required: true }) public getRowId!: (row: T) => string;
  @Input({ required: true }) public getRowDomId!: (row: T) => string;
  @Input({ required: true }) public getCellId!: (row: T, suffix: string) => string;
  @Input({ required: true }) public rowLabel!: (row: T) => string;
  @Input({ required: true }) public columns: IFinesApiSelectableTableColumn[] = [];
  @Input({ required: true }) public content!: IFinesApiSelectableTableContent;
  @Input() public selectedIds: string[] = [];
  @Input() public defaultSort: IAbstractSortState = {};
  @Input() public pageSize: number | null = null;
  @Input() public selectionErrorId: string | null = null;
  @Input() public cellTemplate: TemplateRef<{ $implicit: T; column: IFinesApiSelectableTableColumn }> | null = null;
  @Output() public readonly selectedIdsChange = new EventEmitter<string[]>();

  private syncControls(): void {
    const validIds = new Set(this.rows.map(this.getRowId));
    for (const id of this.rowControls.keys()) {
      if (!validIds.has(id)) this.rowControls.delete(id);
    }
    for (const id of validIds) {
      const selected = this.selectedRowIds().has(id);
      const control = this.rowControls.get(id);
      if (!control) this.rowControls.set(id, new FormControl(selected, { nonNullable: true }));
      else if (control.value !== selected) control.setValue(selected, { emitEvent: false });
    }
    this.selectAllControl.setValue(this.allSelected(), { emitEvent: false });
  }

  /** Emit in supplied row order, independently of the current sort and page. */
  private emitSelection(): void {
    this.syncControls();
    this.selectedIdsChange.emit(this.rows.map(this.getRowId).filter((id) => this.selectedRowIds().has(id)));
  }

  /** Reconcile inputs together so selection restoration does not depend on input assignment order. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) {
      this.paginationEnabled.set(this.pageSize !== null);
      this.itemsPerPageSignal.set(this.pageSize ?? 25);
    }
    if (changes['rows'] || changes['defaultSort']) {
      this.abstractExistingSortState = this.defaultSort;
      this.setTableData(this.rows);
      this.sortStateSignal.set({ ...this.defaultSort });
      const activeSort = Object.entries(this.defaultSort).find(([, direction]) => direction !== 'none');
      this.sortedColumnTitleSignal.set(activeSort?.[0] ?? '');
      this.sortedColumnDirectionSignal.set(activeSort?.[1] ?? 'none');
      this.onApplyFilters();
    }
    if (changes['selectedIds'] || changes['rows'] || changes['getRowId']) {
      const validIds = new Set(this.rows.map(this.getRowId));
      const selection = changes['selectedIds'] ? this.selectedIds : [...this.selectedRowIds()];
      this.selectedRowIds.set(new Set(selection.filter((id) => validIds.has(id))));
      this.syncControls();
    }
  }

  public isSelected(row: T): boolean {
    return this.selectedRowIds().has(this.getRowId(row));
  }

  public toggleAll(checked: boolean): void {
    this.selectedRowIds.set(
      toggleAllMultiSelectRows(this.rows, this.selectedRowIds(), this.getRowId, checked) as Set<string>,
    );
    this.emitSelection();
  }

  public toggleRow(event: { rowId: MultiSelectRowIdentifier; checked: boolean }): void {
    const id = String(event.rowId);
    if (!this.rowControls.has(id)) return;
    this.selectedRowIds.set(toggleMultiSelectRow(this.selectedRowIds(), id, event.checked) as Set<string>);
    this.emitSelection();
  }
}
