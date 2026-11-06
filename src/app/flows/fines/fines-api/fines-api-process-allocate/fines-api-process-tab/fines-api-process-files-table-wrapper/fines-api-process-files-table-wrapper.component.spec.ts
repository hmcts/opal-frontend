import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-api-process-files-table-wrapper-table-sort-default.constant';
import { FinesApiProcessFilesTableWrapperComponent } from './fines-api-process-files-table-wrapper.component';
import { IFinesApiProcessFilesTableWrapperTableData } from './interfaces/fines-api-process-files-table-wrapper-table-data.interface';
import { FinesApiSelectableTableComponent } from '../../../fines-api-selectable-table/fines-api-selectable-table.component';

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
  let fixture: ComponentFixture<FinesApiProcessFilesTableWrapperComponent>;
  const element = (): HTMLElement => fixture.nativeElement;
  const checkbox = (id: string): HTMLInputElement => element().querySelector<HTMLInputElement>(`#${id}`)!;
  const selectedText = (): string =>
    element().querySelector('#fines-api-process-files-selected-count')!.textContent!.trim();
  const table = (): FinesApiSelectableTableComponent<IFinesApiProcessFilesTableWrapperTableData> =>
    fixture.debugElement.query(By.directive(FinesApiSelectableTableComponent)).componentInstance;
  const click = (id: string): void => {
    element().querySelector<HTMLElement>(`#${id}`)!.click();
    fixture.detectChanges();
  };
  const render = (rows: IFinesApiProcessFilesTableWrapperTableData[], selectedIds: string[] = []): void => {
    fixture.componentRef.setInput('existingSortState', FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT);
    fixture.componentRef.setInput('tableData', rows);
    fixture.componentRef.setInput('selectedInterfaceFileIds', selectedIds);
    fixture.detectChanges();
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FinesApiProcessFilesTableWrapperComponent] }).compileComponents();
    fixture = TestBed.createComponent(FinesApiProcessFilesTableWrapperComponent);
  });

  it('renders four sortable columns and formatted dates in supplied order', () => {
    render(buildTableRows(2).reverse());
    expect(Array.from(element().querySelectorAll('th button'), (button) => button.textContent!.trim())).toEqual([
      'File name',
      'Source',
      'Business unit',
      'Date uploaded',
    ]);
    expect(Array.from(element().querySelectorAll('[id$="-name"]'), (cell) => cell.textContent!.trim())).toEqual([
      'payments-002.dat',
      'payments-001.dat',
    ]);
    expect(element().textContent).toContain('02 September 2026 at 09:15');
    expect(table().sortStateSignal()).toEqual(FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT);
  });

  it('preserves the selection announcement and parent heading, hint and error associations', () => {
    fixture.componentRef.setInput('selectionErrorId', 'fines-api-process-files-error');
    render(buildTableRows(1));
    const fieldset = element().querySelector('#fines-api-process-files-select-all-group')!;
    expect(fieldset.getAttribute('aria-labelledby')).toBe('fines-api-process-files-heading');
    expect(fieldset.getAttribute('aria-describedby')).toBe(
      'fines-api-process-files-description fines-api-process-files-selected-count fines-api-process-files-error',
    );
    expect(element().querySelector('#fines-api-process-files-announcement output')!.getAttribute('role')).toBe(
      'status',
    );
    expect(element().querySelector('#fines-api-process-files-selected-count')!.getAttribute('aria-live')).toBe(
      'polite',
    );
    expect(checkbox('fines-api-process-file-1001').getAttribute('aria-label')).toBe('Select payments-001.dat');
  });

  it('selects files with a shared job independently and highlights the selected row', () => {
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    render(buildTableRows(2).map((row) => ({ ...row, interfaceJobId: 'shared-job' })));
    click('fines-api-process-file-1002');
    expect(emit).toHaveBeenLastCalledWith(['1002']);
    expect(selectedText()).toBe('1 of 2 files selected');
    expect(checkbox('fines-api-process-file-1001').checked).toBe(false);
    expect(checkbox('fines-api-process-files-select-all-checkbox').indeterminate).toBe(true);
    expect(
      checkbox('fines-api-process-file-1002').closest('tr')!.classList.contains('govuk-table__row--selected'),
    ).toBe(true);
  });

  it('selects every page and keeps the next page checked', async () => {
    const rows = buildTableRows(30);
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    render(rows);
    expect(element().querySelectorAll('tbody tr')).toHaveLength(25);
    click('fines-api-process-files-select-all-checkbox');
    table().onPageChange(2);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(emit).toHaveBeenLastCalledWith(rows.map((row) => row.interfaceFileId));
    expect(selectedText()).toBe('30 of 30 files selected');
    expect(element().querySelectorAll('tbody tr')).toHaveLength(5);
    expect(checkbox('fines-api-process-file-1026').checked).toBe(true);
    expect(table().pageChangeAnnouncement()).toBe('Page 2 of 2');
    expect(document.activeElement?.id).toBe('fines-api-process-file-1026-cell');
  });

  it('retains selection when sorting, resets to page one and emits IDs in supplied order', () => {
    const rows = buildTableRows(30);
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    render(rows);
    click('fines-api-process-file-1001');
    table().currentPageSignal.set(2);
    table().onSortChange({ key: 'File name', sortType: 'descending' });
    fixture.detectChanges();
    expect(table().currentPageSignal()).toBe(1);
    expect(selectedText()).toBe('1 of 30 files selected');
    click('fines-api-process-file-1030');
    expect(emit).toHaveBeenLastCalledWith(['1001', '1030']);
  });

  it('sorts underlying dates independently of their formatted display', () => {
    const rows = buildTableRows(2);
    rows[0]['Date uploaded'] = 200;
    rows[1]['Date uploaded'] = 100;
    render(rows);
    element().querySelectorAll<HTMLButtonElement>('th button')[3].click();
    fixture.detectChanges();
    expect(element().querySelector('tbody input')!.id).toBe('fines-api-process-file-1002');
  });

  it('restores selections silently and clears them when the external selection becomes null', () => {
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    render(buildTableRows(3), ['1001', '1003', 'missing']);
    expect(selectedText()).toBe('2 of 3 files selected');
    expect(checkbox('fines-api-process-file-1003').checked).toBe(true);
    expect(emit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('selectedInterfaceFileIds', null);
    fixture.detectChanges();
    expect(selectedText()).toBe('0 of 3 files selected');
    expect(emit).not.toHaveBeenCalled();
  });

  it('retains valid selections, emits pruned IDs and resets sorting for replacement data', () => {
    const rows = buildTableRows(3);
    render(rows, ['1001', '1002']);
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    table().onSortChange({ key: 'File name', sortType: 'descending' });
    fixture.componentRef.setInput('tableData', rows.slice(1));
    fixture.detectChanges();
    expect(emit).toHaveBeenLastCalledWith(['1002']);
    expect(selectedText()).toBe('1 of 2 files selected');
    expect(checkbox('fines-api-process-file-1002').checked).toBe(true);
    expect(table().sortStateSignal()).toEqual(FINES_API_PROCESS_FILES_TABLE_WRAPPER_TABLE_SORT_DEFAULT);
    expect(element().querySelector('tbody input')!.id).toBe('fines-api-process-file-1002');
  });

  it('caps Process input at 500 before selecting all rows', () => {
    const emit = vi.spyOn(fixture.componentInstance.selectedInterfaceFileIdsChange, 'emit');
    render(buildTableRows(501));
    click('fines-api-process-files-select-all-checkbox');
    expect(selectedText()).toBe('500 of 500 files selected');
    expect(emit.mock.lastCall![0]).toHaveLength(500);
    expect(emit.mock.lastCall![0]).not.toContain('1501');
  });

  it('hides select-all and pagination for an empty table', () => {
    render([]);
    expect(element().querySelector('#fines-api-process-files-select-all-checkbox')).toBeNull();
    expect(element().querySelector('opal-lib-moj-pagination')).toBeNull();
    expect(selectedText()).toBe('0 of 0 files selected');
  });
});
