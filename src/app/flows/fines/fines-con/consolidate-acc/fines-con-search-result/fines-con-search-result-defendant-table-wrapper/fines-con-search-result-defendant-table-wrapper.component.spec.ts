import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesConSearchResultDefendantTableWrapperComponent } from './fines-con-search-result-defendant-table-wrapper.component';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-con-search-result-defendant-table-wrapper-table-sort-default.constant';
import { GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS } from './mocks/fines-con-search-result-defendant-table-wrapper-table-data.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_EXISTING_SORT_STATE_MOCK } from './mocks/fines-con-search-result-defendant-table-wrapper-existing-sort-state.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_MOCK } from './mocks/fines-con-search-result-defendant-table-wrapper-checks-by-account-id.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_ERROR_MOCK } from './mocks/fines-con-search-result-defendant-table-wrapper-checks-by-account-id-error.mock';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_NULL_ACCOUNT_ID_MOCK } from './mocks/fines-con-search-result-defendant-table-wrapper-table-data-null-account-id.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesConSearchResultDefendantTableWrapperComponent', () => {
  let component: FinesConSearchResultDefendantTableWrapperComponent;
  let fixture: ComponentFixture<FinesConSearchResultDefendantTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesConSearchResultDefendantTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesConSearchResultDefendantTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.existingSortState = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate table data when tableData input is set', () => {
    expect(component['sortedTableDataSignal']()).toEqual(
      GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1),
    );
  });

  it('should set existingSortState input correctly', () => {
    component.existingSortState = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_EXISTING_SORT_STATE_MOCK;

    expect(component['abstractExistingSortState']).toEqual(
      FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_EXISTING_SORT_STATE_MOCK,
    );
  });

  it('should emit account number when goToAccount is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.accountIdClicked, 'emit');

    component.goToAccount(77);

    expect(component.accountIdClicked.emit).toHaveBeenCalledWith(77);
  });

  it('should emit selected account IDs when Add to list is called', () => {
    const emitSpy = vi.spyOn(component.addToList, 'emit');

    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(3);
    fixture.detectChanges();

    const visibleRows = component.sortedTableDataComputed();
    const firstVisibleRowId = component.getRowIdentifier(visibleRows[0], 0);
    component.onRowSelectionChange({ rowId: firstVisibleRowId, checked: true });

    component.onAddToList();

    expect(emitSpy).toHaveBeenCalledWith([visibleRows[0]['Account ID']!]);
  });

  it('should emit selected account IDs when Add to list button is clicked', () => {
    const emitSpy = vi.spyOn(component.addToList, 'emit');

    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(2);
    fixture.detectChanges();

    const visibleRows = component.sortedTableDataComputed();
    const firstVisibleRowId = component.getRowIdentifier(visibleRows[0], 0);
    component.onRowSelectionChange({ rowId: firstVisibleRowId, checked: true });
    fixture.detectChanges();

    const addToListButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.govuk-button');
    addToListButton.click();

    expect(emitSpy).toHaveBeenCalledWith([visibleRows[0]['Account ID']!]);
  });

  it('should render checks under account number when checks are provided', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.checksByAccountId = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_MOCK;

    fixture.detectChanges();

    const checkMessage = fixture.nativeElement.textContent;
    expect(checkMessage).toContain('Account status is Consolidated');
  });

  it('should not select a row when account has an error check', () => {
    const emitSpy = vi.spyOn(component.addToList, 'emit');

    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.checksByAccountId = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_ERROR_MOCK;

    fixture.detectChanges();

    component.onRowSelectionChange({ rowId: 1, checked: true });
    component.onAddToList();

    expect(emitSpy).toHaveBeenCalledWith([]);
  });

  it('should not render select all checkbox when there are no selectable rows', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.checksByAccountId = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_ERROR_MOCK;

    fixture.detectChanges();

    const selectAllCheckbox: HTMLInputElement | null = fixture.nativeElement.querySelector(
      '#defendants-select-all-checkbox',
    );
    expect(selectAllCheckbox).toBeNull();
  });

  it('should remove stale row controls when table data shrinks', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    fixture.detectChanges();

    const currentRow = component.sortedTableDataComputed()[0];
    const currentRowId = component.getRowIdentifier(currentRow, 0);
    const staleRowId = 'stale-row-id';

    component.getRowControl(currentRow, 0);
    component['rowControls'].set(staleRowId, component.getRowControl(currentRow, 0));
    expect(component['rowControls'].has(currentRowId)).toBe(true);
    expect(component['rowControls'].has(staleRowId)).toBe(true);

    component.pruneUnselectableSelections();
    fixture.detectChanges();

    expect(component['rowControls'].has(currentRowId)).toBe(true);
    expect(component['rowControls'].has(staleRowId)).toBe(false);
  });

  it('should resync existing control value when selection state changes', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    fixture.detectChanges();

    const row = component.sortedTableDataComputed()[0];
    const rowId = component.getRowIdentifier(row, 0);
    const existingControl = component.getRowControl(row, 0);
    existingControl.setValue(true);

    const returnedControl = component.getRowControl(row, 0);

    expect(returnedControl).toBe(existingControl);
    expect(returnedControl.value).toBe(false);
    expect(component['selectedRowIdsSignal']().has(rowId)).toBe(false);
  });

  it('should return empty row checks when account id is null', () => {
    const row = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_NULL_ACCOUNT_ID_MOCK;
    component.checksByAccountId = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_MOCK;
    fixture.detectChanges();

    expect(component.getRowChecks(row)).toEqual([]);
  });

  it('should return false for all/some selected when no selectable rows exist', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.checksByAccountId = FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_CHECKS_BY_ACCOUNT_ID_ERROR_MOCK;
    fixture.detectChanges();

    expect(component.allVisibleRowsSelected()).toBe(false);
    expect(component.someVisibleRowsSelected()).toBe(false);
  });

  it('should toggle all selectable rows on and off', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(2);
    fixture.detectChanges();

    component.onToggleAll(true);
    expect(component.allVisibleRowsSelected()).toBe(true);
    expect(component.selectAllControl.value).toBe(true);

    component.onToggleAll(false);
    expect(component.allVisibleRowsSelected()).toBe(false);
    expect(component.selectAllControl.value).toBe(false);
  });

  it('should return true when some selectable visible rows are selected', () => {
    const selectableRows = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(2);
    vi.spyOn(component, 'getSelectableRows').mockReturnValue(selectableRows);
    component['selectedRowIdsSignal'].set(new Set([selectableRows[0]['Account ID']!]));

    expect(component.someVisibleRowsSelected()).toBe(true);
  });

  it('should return true when row id does not map to any current row', () => {
    component.tableData = GENERATE_FINES_CON_SEARCH_RESULT_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    fixture.detectChanges();

    expect(component.isRowIdSelectable('missing-row-id')).toBe(true);
  });
});
