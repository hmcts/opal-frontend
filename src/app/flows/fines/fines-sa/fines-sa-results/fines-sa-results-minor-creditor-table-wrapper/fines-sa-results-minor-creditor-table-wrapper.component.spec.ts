import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsMinorCreditorTableWrapperComponent } from './fines-sa-results-minor-creditor-table-wrapper.component';
import { GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS } from './mocks/fines-sa-result-minor-creditor-table-wrapper-table-data.mock';
import { FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-sa-result-minor-creditor-table-wrapper-table-sort-default.constant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesSaResultsMinorCreditorTableWrapperComponent', () => {
  let component: FinesSaResultsMinorCreditorTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsMinorCreditorTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsMinorCreditorTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsMinorCreditorTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.existingSortState = FINES_SA_RESULTS_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce current template link semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesSaResultsMinorCreditorTableWrapperComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesSaResultsMinorCreditorTableWrapperComponent as any).ɵcmp?.template?.toString() as
        | string
        | undefined) ?? '';
    const actionLinkConsts = templateConsts.filter(
      (entry) =>
        entry.includes('govuk-link') &&
        entry.includes('govuk-link--no-visited-state') &&
        entry.includes('href') &&
        entry.includes('click'),
    );

    expect(actionLinkConsts.length).toBeGreaterThanOrEqual(1);
    actionLinkConsts.forEach((entry) => {
      expect(entry).toContain('href');
      expect(entry).toContain('');
      expect(entry).not.toContain('tabindex');
    });
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should populate table data when tableData input is set', () => {
    expect(component['sortedTableDataSignal']()).toEqual(
      GENERATE_FINES_SA_MINOR_CREDITOR_TABLE_WRAPPER_TABLE_DATA_MOCKS(1),
    );
  });

  it('should set existingSortState input correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortState = { column: 'Name', direction: 'asc' } as any;

    component.existingSortState = sortState;

    expect(component['abstractExistingSortState']).toEqual(sortState);
  });

  it('should emit account number when goToAccount is called', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component.accountIdClicked, 'emit');

    component.goToAccount(123);

    expect(component.accountIdClicked.emit).toHaveBeenCalledWith(123);
  });

  it('should prevent default and emit account id when goToAccount is called with an event', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.accountIdClicked, 'emit');

    component.goToAccount(123, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(123);
  });

  it('should click minor creditor account link and preserve current template click behaviour', () => {
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Minor creditor account link not found');

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'goToAccount');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.accountIdClicked, 'emit');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalledWith(0, event);
    expect(event.defaultPrevented).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(0);
  });
});
