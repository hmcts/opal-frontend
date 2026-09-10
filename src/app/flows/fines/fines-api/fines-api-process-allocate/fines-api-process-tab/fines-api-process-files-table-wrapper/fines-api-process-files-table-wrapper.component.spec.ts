import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-api-process-files-table-wrapper-table-sort-default.constant';
import { FinesApiProcessFilesTableWrapperComponent } from './fines-api-process-files-table-wrapper.component';
import { IFinesApiProcessFilesTableWrapperTableData } from './interfaces/fines-api-process-files-table-wrapper-table-data.interface';

const buildTableRows = (count: number): IFinesApiProcessFilesTableWrapperTableData[] => {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;

    return {
      'File name': `payments-${id.toString().padStart(3, '0')}.dat`,
      Source: id % 2 === 0 ? 'allpay' : 'NatWest',
      'Business unit': id % 2 === 0 ? 'West London' : 'Camberwell Green',
      'Date uploaded': id,
      interfaceJobId: id.toString(),
      interfaceFileId: (id + 1000).toString(),
      dateUploadedDisplay: `${id.toString().padStart(2, '0')} September 2026 at 09:15`,
      status: 'CREATED',
    };
  });
};

describe('FinesApiProcessFilesTableWrapperComponent', () => {
  let component: FinesApiProcessFilesTableWrapperComponent;
  let fixture: ComponentFixture<FinesApiProcessFilesTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiProcessFilesTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesApiProcessFilesTableWrapperComponent);
    component = fixture.componentInstance;
  });

  const render = (rows: IFinesApiProcessFilesTableWrapperTableData[], selectedIds: string[] = []): void => {
    component.existingSortState = FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
    component.tableData = rows;
    component.selectedInterfaceFileIds = selectedIds;
    fixture.detectChanges();
  };

  it('should render the four sortable headers in API order with no initial client sort', () => {
    const rows = [buildTableRows(2)[1], buildTableRows(2)[0]];

    render(rows);

    const tableText = (fixture.nativeElement as HTMLElement).textContent;
    expect(tableText).toContain('File name');
    expect(tableText).toContain('Source');
    expect(tableText).toContain('Business unit');
    expect(tableText).toContain('Date uploaded');
    expect(component.fullTableDataComputed().map((row) => row.interfaceJobId)).toEqual(['2', '1']);
    expect(component.sortStateSignal()).toEqual(FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT);
  });

  it('should expose the file-selection heading and hint to assistive technology', () => {
    render(buildTableRows(1));

    const nativeElement = fixture.nativeElement as HTMLElement;
    const selectAll = nativeElement.querySelector<HTMLInputElement>('#fines-api-process-files-select-all-checkbox');
    const selectedCount = nativeElement.querySelector<HTMLElement>('#fines-api-process-files-selected-count');
    const selectionAnnouncement = nativeElement.querySelector<HTMLOutputElement>(
      '#fines-api-process-files-announcement output',
    );
    const selectAllFieldset = nativeElement.querySelector<HTMLElement>('#fines-api-process-files-select-all-group');

    expect(selectAll).toBeTruthy();
    expect(selectedCount?.textContent?.trim()).toBe('0 of 1 files selected');
    expect(selectedCount?.getAttribute('role')).toBe('status');
    expect(selectedCount?.getAttribute('aria-live')).toBe('polite');
    expect(selectedCount?.getAttribute('aria-atomic')).toBe('true');
    expect(selectionAnnouncement?.getAttribute('role')).toBe('status');
    expect(component.processFilesAnnouncement).toBe('Process files. Select the files you want to process.');
    expect(selectAllFieldset?.getAttribute('aria-labelledby')).toBe('fines-api-process-files-heading');
    expect(selectAllFieldset?.getAttribute('aria-describedby')).toBe(
      'fines-api-process-files-description fines-api-process-files-selected-count',
    );
  });

  it('should associate parent validation with the select-all fieldset', () => {
    component.selectionErrorId = 'fines-api-process-files-error';
    render(buildTableRows(1));

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#fines-api-process-files-select-all-group')
        ?.getAttribute('aria-describedby'),
    ).toBe('fines-api-process-files-description fines-api-process-files-selected-count fines-api-process-files-error');
  });

  it('should independently identify and select files that belong to the same interface job', () => {
    const emitSpy = vi.spyOn(component.selectedInterfaceFileIdsChange, 'emit');
    const rows = buildTableRows(2).map((row) => ({ ...row, interfaceJobId: 'shared-job' }));
    render(rows);

    component.onRowSelectionChange({ rowId: rows[1].interfaceFileId, checked: true });
    fixture.detectChanges();

    expect(component.getRowIdentifier(rows[0])).toBe('1001');
    expect(component.getRowIdentifier(rows[1])).toBe('1002');
    expect(component.getRowDomId(rows[0])).toBe('fines-api-process-file-1001');
    expect(component.getRowDomId(rows[1])).toBe('fines-api-process-file-1002');
    expect(emitSpy).toHaveBeenLastCalledWith(['1002']);
    expect(component.selectedFilesHintComputed()).toBe('1 of 2 files selected');
    expect(component['rowControls'].get(rows[0].interfaceFileId)?.value).toBe(false);
    expect(component['rowControls'].get(rows[1].interfaceFileId)?.value).toBe(true);
  });

  it('should ignore a selection event for a file that is not in the table', () => {
    const emitSpy = vi.spyOn(component.selectedInterfaceFileIdsChange, 'emit');
    render(buildTableRows(1));

    component.onRowSelectionChange({ rowId: '999', checked: true });

    expect(emitSpy).not.toHaveBeenCalled();
    expect(component.selectedFilesCountComputed()).toBe(0);
  });

  it('should select all files across every page and preserve selection after changing page', () => {
    const rows = buildTableRows(30);
    const emitSpy = vi.spyOn(component.selectedInterfaceFileIdsChange, 'emit');
    render(rows);

    component.onToggleAll(true);
    component.currentPageSignal.set(2);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenLastCalledWith(rows.map((row) => row.interfaceFileId));
    expect(component.selectedFilesHintComputed()).toBe('30 of 30 files selected');
    expect(component.paginatedTableDataComputed()).toHaveLength(5);
    expect(component['rowControls'].get(rows[25].interfaceFileId)?.value).toBe(true);
    expect(component.selectAllControl.value).toBe(true);
  });

  it('should retain a selected row across sorting and reset pagination to page one', () => {
    const rows = buildTableRows(30);
    render(rows);
    component.onRowSelectionChange({ rowId: '1030', checked: true });
    component.currentPageSignal.set(2);

    component.onSortChange({ key: 'File name', sortType: 'descending' });

    expect(component.currentPageSignal()).toBe(1);
    expect(component.fullTableDataComputed()[0].interfaceJobId).toBe('30');
    expect(component['rowControls'].get(rows[29].interfaceFileId)?.value).toBe(true);
    expect(component.selectedFilesCountComputed()).toBe(1);
  });

  it('should restore externally persisted selections', () => {
    const rows = buildTableRows(3);

    render(rows, ['1001', '1003']);

    expect(component.selectedFilesCountComputed()).toBe(2);
    expect(component['rowControls'].get(rows[0].interfaceFileId)?.value).toBe(true);
    expect(component['rowControls'].get(rows[1].interfaceFileId)?.value).toBe(false);
    expect(component['rowControls'].get(rows[2].interfaceFileId)?.value).toBe(true);
    expect(component.someRowsSelected()).toBe(true);
  });

  it('should treat a null persisted selection as empty', () => {
    const rows = buildTableRows(1);
    component.existingSortState = FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT;
    component.tableData = rows;

    component.selectedInterfaceFileIds = null;

    expect(component.selectedFilesCountComputed()).toBe(0);
    expect(component['rowControls'].get(rows[0].interfaceFileId)?.value).toBe(false);
  });

  it('should initialise and synchronise row controls before template evaluation', () => {
    const rows = buildTableRows(2);
    component.existingSortState = FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    component.tableData = rows;

    const firstControl = component['rowControls'].get(rows[0].interfaceFileId);
    expect(component['rowControls'].size).toBe(rows.length);
    expect(firstControl?.value).toBe(false);

    component.selectedInterfaceFileIds = [rows[0].interfaceFileId];

    expect(component['rowControls'].get(rows[0].interfaceFileId)).toBe(firstControl);
    expect(firstControl?.value).toBe(true);

    const mapSetSpy = vi.spyOn(component['rowControls'], 'set');
    const controlSetValueSpy = vi.spyOn(firstControl!, 'setValue');

    fixture.detectChanges();

    expect(mapSetSpy).not.toHaveBeenCalled();
    expect(controlSetValueSpy).not.toHaveBeenCalled();
  });

  it('should prune and emit selections missing from refreshed table data', () => {
    const rows = buildTableRows(3);
    render(rows);
    component.onRowSelectionChange({ rowId: '1001', checked: true });
    component.onRowSelectionChange({ rowId: '1002', checked: true });
    const emitSpy = vi.spyOn(component.selectedInterfaceFileIdsChange, 'emit');

    component.tableData = rows.slice(1);

    expect(component.selectedFilesCountComputed()).toBe(1);
    expect(component['rowControls'].has(rows[0].interfaceFileId)).toBe(false);
    expect(emitSpy).toHaveBeenLastCalledWith(['1002']);
  });

  it('should cap direct table input at 500 rows', () => {
    render(buildTableRows(501));

    component.onToggleAll(true);

    expect(component.fullTableDataComputed()).toHaveLength(500);
    expect(component.selectedFilesCountComputed()).toBe(500);
  });

  it('should not render select-all or pagination for an empty table', () => {
    render([]);

    const nativeElement = fixture.nativeElement as HTMLElement;
    expect(nativeElement.querySelector('#fines-api-process-files-select-all-checkbox')).toBeNull();
    expect(nativeElement.querySelector('opal-lib-moj-pagination')).toBeNull();
    expect(component.selectedFilesHintComputed()).toBe('0 of 0 files selected');
  });
});
