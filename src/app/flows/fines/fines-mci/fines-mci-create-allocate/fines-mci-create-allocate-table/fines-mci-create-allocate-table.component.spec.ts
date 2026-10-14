import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { MojSortableTableHeaderComponent } from '@hmcts/opal-frontend-common/components/moj/moj-sortable-table';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT } from './constants/fines-mci-create-allocate-table-sort-default.constant';
import { FinesMciCreateAllocateTableComponent } from './fines-mci-create-allocate-table.component';
import { IFinesMciCreateAllocateTableData } from './interfaces/fines-mci-create-allocate-table-data.interface';
import { IFinesMciCreateAllocateTableSort } from './interfaces/fines-mci-create-allocate-table-sort.interface';

const TABLE_ROWS: IFinesMciCreateAllocateTableData[] = [
  {
    tillId: '99000000010005',
    'Till number': '9005',
    Payments: 3,
    Amount: 1234.56,
    'Business unit': 'Westminster - North (Wells Street)',
    'Created by': 'Finance officer',
    'Date created': Date.UTC(2025, 5, 12),
    dateCreatedDisplay: '12 June 2025',
  },
  {
    tillId: '99000000010006',
    'Till number': '9006',
    Payments: 1,
    Amount: 25,
    'Business unit': 'Camberwell Green',
    'Created by': null,
    'Date created': Date.UTC(2025, 5, 13),
    dateCreatedDisplay: '13 June 2025',
  },
];

describe('FinesMciCreateAllocateTableComponent', () => {
  let component: FinesMciCreateAllocateTableComponent;
  let fixture: ComponentFixture<FinesMciCreateAllocateTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesMciCreateAllocateTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMciCreateAllocateTableComponent);
    component = fixture.componentInstance;
  });

  const render = (
    rows: IFinesMciCreateAllocateTableData[] = TABLE_ROWS,
    sortState: IFinesMciCreateAllocateTableSort = FINES_MCI_CREATE_ALLOCATE_TABLE_SORT_DEFAULT,
  ): void => {
    fixture.componentRef.setInput('tableData', rows);
    fixture.componentRef.setInput('existingSortState', sortState);
    fixture.detectChanges();
  };

  it('should create and extend the shared sortable table component', () => {
    render();

    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(AbstractSortableTableComponent);
  });

  it('should render the table headings and till data', () => {
    render();

    const nativeElement = fixture.nativeElement as HTMLElement;
    const tableText = nativeElement.textContent ?? '';

    expect(tableText).toContain('Till number');
    expect(tableText).toContain('Payments');
    expect(tableText).toContain('Amount');
    expect(tableText).toContain('Business unit');
    expect(tableText).toContain('Created by');
    expect(tableText).toContain('Date created');
    expect(tableText).toContain('9005');
    expect(tableText).toContain('£1,234.56');
    expect(tableText).toContain('Westminster - North (Wells Street)');
    expect(tableText).toContain('Finance officer');
    expect(tableText).toContain('12 June 2025');
    expect(tableText).toContain('13 June 2025');
    const tillNumberCell = nativeElement.querySelector('#fines-mci-create-allocate-99000000010005-till-number');
    expect(tillNumberCell?.textContent?.trim()).toBe('9005');
    expect(tillNumberCell?.querySelector('a')).toBeNull();
    expect(nativeElement.querySelector('#fines-mci-create-allocate-99000000010005')).toBeTruthy();
    expect(nativeElement.querySelector('#fines-mci-create-allocate-99000000010006')).toBeTruthy();
  });

  it('should show the selected count and emit it when a till is selected and deselected', () => {
    const emitSpy = vi.spyOn(component.selectedTillsCountChange, 'emit');
    render();

    component.onRowSelectionChange({ rowId: TABLE_ROWS[0].tillId, checked: true });
    fixture.detectChanges();

    expect(component.selectedTillsCountComputed()).toBe(1);
    expect(component.selectedTillsHintComputed()).toBe('1 of 2 selected');
    expect(component['rowControls'].get(TABLE_ROWS[0].tillId)?.value).toBe(true);
    expect(emitSpy).toHaveBeenLastCalledWith(1);

    component.onRowSelectionChange({ rowId: TABLE_ROWS[0].tillId, checked: false });
    fixture.detectChanges();

    expect(component.selectedTillsCountComputed()).toBe(0);
    expect(component.selectedTillsHintComputed()).toBe('0 of 2 selected');
    expect(component['rowControls'].get(TABLE_ROWS[0].tillId)?.value).toBe(false);
    expect(emitSpy).toHaveBeenLastCalledWith(0);
  });

  it('should ignore selection changes for tills that are not in the table', () => {
    const emitSpy = vi.spyOn(component.selectedTillsCountChange, 'emit');
    render();

    component.onRowSelectionChange({ rowId: 'unknown-till', checked: true });

    expect(component.selectedTillsCountComputed()).toBe(0);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should select and deselect all tills and maintain the select-all control', () => {
    const emitSpy = vi.spyOn(component.selectedTillsCountChange, 'emit');
    render();

    component.onToggleAll(true);

    expect(component.selectedTillsCountComputed()).toBe(2);
    expect(component.allRowsSelected()).toBe(true);
    expect(component.someRowsSelected()).toBe(false);
    expect(component.selectAllControl.value).toBe(true);
    expect(component['rowControls'].get(TABLE_ROWS[0].tillId)?.value).toBe(true);
    expect(component['rowControls'].get(TABLE_ROWS[1].tillId)?.value).toBe(true);
    expect(emitSpy).toHaveBeenLastCalledWith(2);

    component.onToggleAll(false);

    expect(component.selectedTillsCountComputed()).toBe(0);
    expect(component.allRowsSelected()).toBe(false);
    expect(component.selectAllControl.value).toBe(false);
    expect(emitSpy).toHaveBeenLastCalledWith(0);
  });

  it('should report a partial selection when only some tills are selected', () => {
    render();

    component.onRowSelectionChange({ rowId: TABLE_ROWS[1].tillId, checked: true });

    expect(component.allRowsSelected()).toBe(false);
    expect(component.someRowsSelected()).toBe(true);
    expect(component.selectAllControl.value).toBe(false);
  });

  it('should sort tills when a supported column sort changes', () => {
    render();
    const tillNumberHeader = fixture.debugElement
      .queryAll(By.directive(MojSortableTableHeaderComponent))
      .find((header) => header.componentInstance.columnKey === 'Till number');

    tillNumberHeader?.triggerEventHandler('sortChange', { key: 'Till number', sortType: 'ascending' });
    fixture.detectChanges();

    expect(component.sortedColumnTitleSignal()).toBe('Till number');
    expect(component.sortedColumnDirectionSignal()).toBe('ascending');
    expect(component.fullTableDataComputed().map((row) => row['Till number'])).toEqual(['9005', '9006']);

    tillNumberHeader?.triggerEventHandler('sortChange', { key: 'Till number', sortType: 'descending' });
    fixture.detectChanges();

    expect(component.fullTableDataComputed().map((row) => row['Till number'])).toEqual(['9006', '9005']);
  });

  it('should create stable row identifiers and sanitize them for DOM ids', () => {
    render([
      {
        ...TABLE_ROWS[0],
        tillId: 'till / 9005',
      },
    ]);

    expect(component.getRowIdentifier({ ...TABLE_ROWS[0], tillId: 'till / 9005' })).toBe('till / 9005');
    expect(component.getRowDomId({ ...TABLE_ROWS[0], tillId: 'till / 9005' })).toBe(
      'fines-mci-create-allocate-till---9005',
    );
  });
});
