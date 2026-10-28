import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiSelectableTableComponent } from './fines-api-selectable-table.component';

// These rows deliberately have a supplied order different from their sortable values.
const rows = [
  { id: 'second', Name: 'Zebra' },
  { id: 'first', Name: 'Alpha' },
];

describe('FinesApiSelectableTableComponent', () => {
  let fixture: ComponentFixture<FinesApiSelectableTableComponent<(typeof rows)[number]>>;
  const element = (): HTMLElement => fixture.nativeElement;
  const checkbox = (id: string): HTMLInputElement => element().querySelector<HTMLInputElement>(`#${id}`)!;
  const click = (id: string): void => {
    checkbox(id).click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FinesApiSelectableTableComponent] }).compileComponents();
    fixture = TestBed.createComponent(FinesApiSelectableTableComponent<(typeof rows)[number]>);
    fixture.componentRef.setInput('getRowId', (row: (typeof rows)[number]) => row.id);
    fixture.componentRef.setInput('getRowDomId', (row: (typeof rows)[number]) => `row-${row.id}`);
    fixture.componentRef.setInput('getCellId', (row: (typeof rows)[number], suffix: string) => `${row.id}-${suffix}`);
    fixture.componentRef.setInput('rowLabel', (row: (typeof rows)[number]) => `Select ${row.Name}`);
    fixture.componentRef.setInput('columns', [{ key: 'Name', idSuffix: 'name' }]);
    fixture.componentRef.setInput('defaultSort', { Name: 'none' });
    fixture.componentRef.setInput('content', {
      id: 'example-table',
      caption: 'Example rows',
      selectAllId: 'select-all',
      selectAll: 'Select all rows',
      selectionLegend: 'Select rows',
      descriptionId: 'hint',
      selectedCountId: 'count',
      selectionCellSuffix: 'select',
      paginationId: 'pages',
      selected: (count: number, total: number) => `${count} of ${total} selected`,
    });
  });

  it('restores selection regardless of input assignment order without emitting', () => {
    const emit = vi.spyOn(fixture.componentInstance.selectedIdsChange, 'emit');
    fixture.componentRef.setInput('selectedIds', ['first', 'unknown']);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    expect(checkbox('row-first').checked).toBe(true);
    expect(checkbox('row-second').checked).toBe(false);
    expect(checkbox('select-all').indeterminate).toBe(true);
    expect(element().querySelector('#count')!.textContent).toContain('1 of 2 selected');
    expect(emit).not.toHaveBeenCalled();
  });

  it('manages selection without a bound selection input and ignores unknown row events', () => {
    const emit = vi.spyOn(fixture.componentInstance.selectedIdsChange, 'emit');
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    fixture.componentInstance.toggleRow({ rowId: 'unknown', checked: true });
    expect(emit).not.toHaveBeenCalled();
    click('row-first');
    click('row-second');
    expect(emit).toHaveBeenLastCalledWith(['second', 'first']);
    expect(checkbox('select-all').checked).toBe(true);
    expect(checkbox('select-all').indeterminate).toBe(false);
    click('select-all');
    expect(emit).toHaveBeenLastCalledWith([]);
    expect(checkbox('row-first').checked).toBe(false);
    expect(checkbox('row-second').checked).toBe(false);
  });

  it('reconciles removed rows without retaining stale checkbox state', () => {
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    click('select-all');
    fixture.componentRef.setInput('rows', [rows[0]]);
    fixture.detectChanges();
    expect(element().querySelector('#row-first')).toBeNull();
    expect(checkbox('row-second').checked).toBe(true);
    expect(element().querySelector('#count')!.textContent).toContain('1 of 1 selected');
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    expect(checkbox('row-first').checked).toBe(false);
    expect(checkbox('select-all').indeterminate).toBe(true);
  });

  it('supports enabling and disabling pagination without losing off-page selections', () => {
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();
    click('select-all');
    fixture.componentRef.setInput('pageSize', 1);
    fixture.detectChanges();
    expect(element().querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element().querySelector('opal-lib-moj-pagination')).not.toBeNull();
    expect(element().querySelector('#count')!.textContent).toContain('2 of 2 selected');
    fixture.componentRef.setInput('pageSize', null);
    fixture.detectChanges();
    expect(element().querySelectorAll('tbody tr')).toHaveLength(2);
    expect(element().querySelector('opal-lib-moj-pagination')).toBeNull();
    expect(checkbox('row-first').checked).toBe(true);
  });
});
