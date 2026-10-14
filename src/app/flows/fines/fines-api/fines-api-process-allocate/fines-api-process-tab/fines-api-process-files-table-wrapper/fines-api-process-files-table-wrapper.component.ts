import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FinesApiSelectableTableComponent } from '../../../fines-api-selectable-table/fines-api-selectable-table.component';
import { IFinesApiSelectableTableColumn } from '../../../fines-api-selectable-table/interfaces/fines-api-selectable-table-column.interface';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT } from './constants/fines-api-process-files-table-wrapper-content.constant';
import { IFinesApiProcessFilesTableWrapperTableData } from './interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { IFinesApiProcessFilesTableWrapperTableSort } from './interfaces/fines-api-process-files-table-wrapper-table-sort.interface';

@Component({
  selector: 'app-fines-api-process-files-table-wrapper',
  imports: [FinesApiSelectableTableComponent],
  templateUrl: './fines-api-process-files-table-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesApiProcessFilesTableWrapperComponent implements OnChanges {
  private readonly maxResults = 500;
  protected readonly rows = signal<IFinesApiProcessFilesTableWrapperTableData[]>([]);
  protected readonly selectedIds = signal<string[]>([]);
  protected readonly content = {
    ...FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT,
    id: 'fines-api-process-files',
    selectAllId: 'fines-api-process-files-select-all-checkbox',
    selectAllGroupId: 'fines-api-process-files-select-all-group',
    selectColumnId: 'fines-api-process-files-select-all',
    headingId: 'fines-api-process-files-heading',
    descriptionId: 'fines-api-process-files-description',
    selectedCountId: 'fines-api-process-files-selected-count',
    announcementId: 'fines-api-process-files-announcement',
    paginationId: 'fines-api-process-files-pagination',
    selectionCellSuffix: 'cell',
    selected: FINES_API_PROCESS_FILES_TABLE_WRAPPER_CONTENT.selectedFiles,
  };
  protected readonly columns: IFinesApiSelectableTableColumn[] = [
    { key: this.content.columns.fileName, idSuffix: 'name' },
    { key: this.content.columns.source, idSuffix: 'source' },
    { key: this.content.columns.businessUnit, idSuffix: 'business-unit' },
    { key: this.content.columns.dateUploaded, idSuffix: 'date-uploaded', displayKey: 'dateUploadedDisplay' },
  ];
  @Input() public selectionErrorId: string | null = null;
  @Input({ required: true }) public existingSortState: IFinesApiProcessFilesTableWrapperTableSort | null = null;
  @Output() public readonly selectedInterfaceFileIdsChange = new EventEmitter<string[]>();

  @Input({ required: true }) public tableData: IFinesApiProcessFilesTableWrapperTableData[] = [];
  @Input() public selectedInterfaceFileIds: string[] | null = null;

  protected readonly getRowId = (row: IFinesApiProcessFilesTableWrapperTableData): string => row.interfaceFileId;
  protected readonly getRowDomId = (row: IFinesApiProcessFilesTableWrapperTableData): string =>
    `fines-api-process-file-${row.interfaceFileId.replaceAll(/[^a-zA-Z0-9_-]/g, '-')}`;
  protected readonly getCellId = (row: IFinesApiProcessFilesTableWrapperTableData, suffix: string): string =>
    `${this.getRowDomId(row)}-${suffix}`;
  protected readonly rowLabel = (row: IFinesApiProcessFilesTableWrapperTableData): string =>
    this.content.selectFile(row[this.content.columns.fileName]);

  protected selectionChanged(ids: string[]): void {
    this.selectedIds.set(ids);
    this.selectedInterfaceFileIdsChange.emit(ids);
  }

  /** Apply the Process cap and reconcile replacement rows with persisted selection together. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) this.rows.set(this.tableData.slice(0, this.maxResults));
    if (!changes['tableData'] && !changes['selectedInterfaceFileIds']) return;
    const previous = changes['selectedInterfaceFileIds'] ? (this.selectedInterfaceFileIds ?? []) : this.selectedIds();
    const selected = new Set(previous);
    const next = this.rows()
      .map(this.getRowId)
      .filter((id) => selected.has(id));
    this.selectedIds.set(next);
    // Restoring external state is silent. Only replacement pruning updates the store.
    if (!changes['selectedInterfaceFileIds'] && next.length !== selected.size) {
      this.selectedInterfaceFileIdsChange.emit(next);
    }
  }
}
