import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiAllocateComponent } from './fines-api-allocate.component';
import { IFinesApiAllocateData } from './interfaces/fines-api-allocate-data.interface';
import { IFinesApiAllocateTillsTableWrapperTableData } from './fines-api-allocate-tills-table-wrapper/interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

const rows = (count = 2): IFinesApiAllocateTillsTableWrapperTableData[] =>
  Array.from({ length: count }, (_, index) => ({
    tillId: String(101 + index),
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
  let fixture: ComponentFixture<FinesApiAllocateComponent>;
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
    await TestBed.configureTestingModule({
      imports: [FinesApiAllocateComponent],
      providers: [provideRouter([])],
    }).compileComponents();
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
      expect(element().textContent).toContain('There are no outstanding tills to allocate');
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

  it('does not submit a form or require a selection when Allocate is clicked', () => {
    render(data());
    const button = element().querySelector<HTMLButtonElement>('#fines-api-allocate-submit')!;
    expect(button.type).toBe('button');
    click('fines-api-allocate-submit');
    expect(selectedText()).toBe('0 of 2 tills selected.');
    expect(element().querySelector('.govuk-error-summary')).toBeNull();
  });
});
