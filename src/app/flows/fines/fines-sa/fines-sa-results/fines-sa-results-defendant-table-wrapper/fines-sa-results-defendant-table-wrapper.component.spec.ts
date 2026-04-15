import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesSaResultsDefendantTableWrapperComponent } from './fines-sa-results-defendant-table-wrapper.component';
import { FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT } from './constants/fines-sa-results-defendant-table-wrapper-table-sort-default.constant';
import { GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS } from './mock/fines-sa-results-defendant-table-wrapper-table-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('FinesSaResultsDefendantTableWrapperComponent', () => {
  let component: FinesSaResultsDefendantTableWrapperComponent;
  let fixture: ComponentFixture<FinesSaResultsDefendantTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesSaResultsDefendantTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesSaResultsDefendantTableWrapperComponent);
    component = fixture.componentInstance;

    component.tableData = GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1);
    component.existingSortState = FINES_SA_RESULTS_DEFENDANT_TABLE_WRAPPER_TABLE_SORT_DEFAULT;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enforce current template link semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesSaResultsDefendantTableWrapperComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesSaResultsDefendantTableWrapperComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
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
    expect(component['sortedTableDataSignal']()).toEqual(GENERATE_FINES_SA_DEFENDANT_TABLE_WRAPPER_TABLE_DATA_MOCKS(1));
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

    component.goToAccount(77);

    expect(component.accountIdClicked.emit).toHaveBeenCalledWith(77);
  });

  it('should prevent default and emit account id when goToAccount is called with an event', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emitSpy = vi.spyOn<any, any>(component.accountIdClicked, 'emit');

    component.goToAccount(77, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(77);
  });

  it('should click account link and prevent default via the passed template event', () => {
    const link = fixture.nativeElement.querySelector('a.govuk-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    if (!link) throw new Error('Account link not found');

    expect(link.classList.contains('govuk-link--no-visited-state')).toBe(true);
    expect(link.getAttribute('href')).toBe('');
    expect(link.getAttribute('tabindex')).toBeNull();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlerSpy = vi.spyOn<any, any>(component, 'goToAccount');

    link.dispatchEvent(event);

    expect(handlerSpy).toHaveBeenCalled();
    expect(handlerSpy.mock.calls[0][0]).toBe(1);
    expect(handlerSpy.mock.calls[0][1]).toBe(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
