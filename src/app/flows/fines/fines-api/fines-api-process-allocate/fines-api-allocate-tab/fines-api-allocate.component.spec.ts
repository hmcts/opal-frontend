import { By } from '@angular/platform-browser';
import { FinesApiAllocateTillsTableWrapperComponent } from './fines-api-allocate-tills-table-wrapper/fines-api-allocate-tills-table-wrapper.component';
import { Subject } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FinesApiStore } from '../../stores/fines-api.store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiAllocateComponent } from './fines-api-allocate.component';
import { IFinesApiAllocateData } from './interfaces/fines-api-allocate-data.interface';
import { IFinesApiAllocateTillsTableWrapperTableData } from './fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

const rows = (count = 2): IFinesApiAllocateTillsTableWrapperTableData[] =>
  Array.from({ length: count }, (_, index) => ({
    tillId: String(101 + index),
    businessUnitId: 77 + index,
    'Till number': 7,
    Errors: index,
    Filename: `payments-${index}.dat`,
    Source: 'NatWest',
    Amount: 123.45,
    'Business Unit': `BU ${index === 0 ? 'Alpha' : 'Beta'}`,
    'Processed by': 'original.operator',
    'Date processed': 1_790_085_060_000,
    dateProcessedDisplay: '22 September 2026 at 14:31',
  }));
const data = (tills = rows(), processingTotal = 0): IFinesApiAllocateData => ({
  tills,
  processingTotal,
  processingByBusinessUnit: processingTotal
    ? [
        { businessUnitName: 'BU Alpha', count: 2 },
        { businessUnitName: 'BU Beta', count: 1 },
      ]
    : [],
});

describe('FinesApiAllocateComponent', () => {
  let response: Subject<void>;
  let allocateTills: ReturnType<typeof vi.fn>;
  let store: InstanceType<typeof FinesApiStore>;
  let fixture: ComponentFixture<FinesApiAllocateComponent>;
  const table = (): FinesApiAllocateTillsTableWrapperComponent =>
    fixture.debugElement.query(By.directive(FinesApiAllocateTillsTableWrapperComponent)).componentInstance;
  const element = (): HTMLElement => fixture.nativeElement;
  const checkbox = (id: string): HTMLInputElement => element().querySelector<HTMLInputElement>(`#${id}`)!;
  const selectedText = (): string => element().querySelector('#fines-api-allocate-selected-count')!.textContent!.trim();
  const render = (value: IFinesApiAllocateData): void => {
    fixture.componentRef.setInput('tabData', value);
    fixture.detectChanges();
  };
  const click = (id: string): void => {
    element().querySelector<HTMLElement>(`#${id}`)!.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    response = new Subject<void>();
    allocateTills = vi.fn().mockReturnValue(response);
    await TestBed.configureTestingModule({
      imports: [FinesApiAllocateComponent],
      providers: [provideRouter([]), { provide: OpalFines, useValue: { allocateTills } }],
    }).compileComponents();
    vi.spyOn(TestBed.inject(UtilsService), 'scrollToTop').mockImplementation(() => {});
    store = TestBed.inject(FinesApiStore);
    fixture = TestBed.createComponent(FinesApiAllocateComponent);
  });

  it.each([
    [0, 0],
    [0, 3],
    [2, 0],
    [2, 3],
  ])('renders %i tills independently of %i processing files', (tillCount, processingCount) => {
    render(data(rows(tillCount), processingCount));
    expect(!!element().querySelector('#fines-api-allocate-processing')).toBe(processingCount > 0);
    expect(!!element().querySelector('table')).toBe(tillCount > 0);
    expect(!!element().querySelector('#fines-api-allocate-submit')).toBe(tillCount > 0);
    expect(!!element().querySelector('#fines-api-allocate-selected-count')).toBe(tillCount > 0);
    expect(!!element().querySelector('#fines-api-allocate-empty')).toBe(tillCount === 0);
    expect(element().querySelector('#fines-api-allocate-refresh')).toBeTruthy();
    if (tillCount === 0) {
      expect(element().textContent).toContain('There are no tills ready to allocate');
    }
  });

  it('renders the information banner total and mapped business-unit breakdown', () => {
    render(data([], 3));
    const banner = element().querySelector('#fines-api-allocate-processing')!;
    expect(banner.classList.contains('moj-alert--information')).toBe(true);
    expect(banner.textContent).toContain('3 files are still being processed:');
    expect(Array.from(banner.querySelectorAll('li'), (li) => li.textContent?.trim())).toEqual([
      'BU Alpha (2)',
      'BU Beta (1)',
    ]);
  });

  it('clears selections before requesting refresh', () => {
    render(data());
    expect((fixture.componentInstance as unknown as { table: () => unknown }).table()).toBeTruthy();
    click('fines-api-allocate-select-all');
    const emitted = vi.fn();
    fixture.componentInstance.refreshRequested.subscribe(emitted);
    click('fines-api-allocate-refresh');
    expect(emitted).toHaveBeenCalledOnce();
    expect(selectedText()).toBe('0 of 2 tills selected.');
    expect(checkbox('fines-api-allocate-select-all').checked).toBe(false);
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(false);
  });

  it('allows refresh from the empty state', () => {
    render(data([]));
    const emitted = vi.fn();
    fixture.componentInstance.refreshRequested.subscribe(emitted);
    click('fines-api-allocate-refresh');
    expect(emitted).toHaveBeenCalledOnce();
  });

  it('requires a selection without submitting or navigating', () => {
    render(data());
    const button = element().querySelector<HTMLButtonElement>('#fines-api-allocate-submit')!;
    expect(button.type).toBe('button');
    click('fines-api-allocate-submit');
    expect(selectedText()).toBe('0 of 2 tills selected.');
    expect(element().querySelector('.govuk-error-summary')?.textContent).toContain(
      'Select at least 1 till to allocate.',
    );
    expect(allocateTills).not.toHaveBeenCalled();
    click('fines-api-allocate-till-101');
    expect(element().querySelector('.govuk-error-summary')).toBeNull();
  });

  it('links the selection error to a focusable checkbox and associates the inline error', () => {
    render(data());
    click('fines-api-allocate-submit');
    const link = element().querySelector<HTMLAnchorElement>('.govuk-error-summary a')!;
    const focus = vi.spyOn(checkbox('fines-api-allocate-select-all'), 'focus');
    link.click();
    expect(focus).toHaveBeenCalledOnce();
    expect(element().querySelector('#fines-api-allocate-select-all-group')?.getAttribute('aria-describedby')).toContain(
      'fines-api-allocate-selection-error',
    );
  });

  it('submits one snapshot across business units and removes only those tills on acknowledgement', () => {
    render(data(rows(3), 3));
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-till-102');
    click('fines-api-allocate-submit');
    expect(allocateTills).toHaveBeenCalledWith({
      tills: [
        { till_id: 101, business_unit_id: 77 },
        { till_id: 102, business_unit_id: 78 },
      ],
    });
    expect(element().querySelector<HTMLButtonElement>('#fines-api-allocate-refresh')!.disabled).toBe(true);
    click('fines-api-allocate-submit');
    expect(allocateTills).toHaveBeenCalledOnce();
    expect(element().querySelector('#fines-api-allocate-success')).toBeNull();
    // Selection changes during the request must not change the acknowledgement or removed rows.
    click('fines-api-allocate-till-103');
    response.next();
    response.complete();
    fixture.detectChanges();
    expect(element().querySelector('#fines-api-allocate-till-101')).toBeNull();
    expect(element().querySelector('#fines-api-allocate-till-102')).toBeNull();
    expect(element().querySelector('#fines-api-allocate-till-103')).toBeTruthy();
    expect(element().querySelector('#fines-api-allocate-success')?.textContent).toContain(
      '2 tills have been sent for allocation.',
    );
    expect(element().querySelector('#fines-api-allocate-cash-list-report')?.getAttribute('href')).toBe(
      '/fines/reports/cash_list/summary-list',
    );
    expect(element().querySelector('#fines-api-allocate-processing')?.textContent).toContain('3 files');
    expect(table().getSelectedIds()).toEqual([]);
    expect(store.unsavedChanges()).toBe(false);
    expect(selectedText()).toBe('0 of 1 tills selected.');
  });

  it('keeps singular acknowledgement and report link when the last row is removed', () => {
    render(data(rows(1)));
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-submit');
    response.next();
    response.complete();
    fixture.detectChanges();
    expect(element().querySelector('#fines-api-allocate-success')?.textContent).toContain(
      '1 till has been sent for allocation.',
    );
    expect(element().querySelector('#fines-api-allocate-empty')?.textContent).toBe(
      'There are no tills ready to allocate',
    );
    expect(element().querySelector('table')).toBeNull();
    expect(element().querySelector('#fines-api-allocate-cash-list-report')).toBeTruthy();
    click('fines-api-allocate-refresh');
    expect(element().querySelector('#fines-api-allocate-success')).toBeNull();
    render(data(rows(1)));
    expect(element().querySelector('#fines-api-allocate-till-101')).toBeTruthy();
  });

  it('retains rows and selection after rejection without acknowledging or automatically retrying', () => {
    render(data());
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-submit');
    response.error(new Error('Request rejected'));
    fixture.detectChanges();
    expect(allocateTills).toHaveBeenCalledOnce();
    expect(element().querySelector('#fines-api-allocate-success')).toBeNull();
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(true);
    expect(selectedText()).toBe('1 of 2 tills selected.');
    expect(element().querySelector<HTMLButtonElement>('#fines-api-allocate-submit')!.disabled).toBe(false);
  });

  it('does not treat completion without an HTTP response as successful submission', () => {
    render(data());
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-submit');
    response.complete();
    fixture.detectChanges();
    expect(element().querySelector('#fines-api-allocate-success')).toBeNull();
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(true);
  });

  it('rejects stale selection before sending a request', () => {
    render(data());
    vi.spyOn(table(), 'getSelectedIds').mockReturnValue(['999']);
    click('fines-api-allocate-submit');
    expect(allocateTills).not.toHaveBeenCalled();
    expect(element().querySelector('.govuk-error-summary')?.textContent).toContain('Refresh the page and try again.');
  });

  it('cancels the view subscription when destroyed without resending', () => {
    render(data());
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-submit');
    fixture.destroy();
    response.next();
    expect(response.observed).toBe(false);
    expect(allocateTills).toHaveBeenCalledOnce();
  });

  it('keeps till selection local without marking the journey as unsaved', () => {
    render(data());
    click('fines-api-allocate-till-101');
    expect(table().getSelectedIds()).toEqual(['101']);
    expect(store.unsavedChanges()).toBe(false);
    const snapshot = table().getSelectedIds();
    snapshot.push('102');
    expect(table().getSelectedIds()).toEqual(['101']);
    click('fines-api-allocate-refresh');
    click('fines-api-allocate-submit');
    expect(allocateTills).not.toHaveBeenCalled();
    expect(element().querySelector('.govuk-error-summary')?.textContent).toContain(
      'Select at least 1 till to allocate.',
    );
  });
});
