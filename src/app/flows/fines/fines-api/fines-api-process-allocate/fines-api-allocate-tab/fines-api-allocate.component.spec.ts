import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiAllocateComponent } from './fines-api-allocate.component';
import { IFinesApiAllocateData, IFinesApiAllocateTillRow } from './interfaces/fines-api-allocate-data.interface';

const rows = (count = 2): IFinesApiAllocateTillRow[] =>
  Array.from({ length: count }, (_, index) => ({
    tillId: String(101 + index),
    tillNumber: '7',
    errorsDisplay: String(index),
    fileName: `payments-${index}.dat`,
    sourceLabel: 'NatWest',
    amountDisplay: '£123.45',
    businessUnitName: `BU ${index === 0 ? 'Alpha' : 'Beta'}`,
    processedByDisplay: 'original.operator',
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
    await TestBed.configureTestingModule({ imports: [FinesApiAllocateComponent] }).compileComponents();
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
    expect(banner.textContent).toContain('3 files are processing.');
    expect(Array.from(banner.querySelectorAll('li'), (li) => li.textContent?.trim())).toEqual([
      'BU Alpha: 2',
      'BU Beta: 1',
    ]);
  });

  it('renders every mapped column in backend order without sorting controls', () => {
    const tillRows = rows().reverse();
    render(data(tillRows));
    const headers = Array.from(element().querySelectorAll('thead th'), (cell) => cell.textContent!.trim());
    expect(headers.slice(1)).toEqual([
      'Till number',
      'Errors',
      'Filename',
      'Source',
      'Amount',
      'Business Unit',
      'Processed by',
      'Date processed',
    ]);
    const cells = Array.from(element().querySelector('tbody tr')!.querySelectorAll('td'), (cell) =>
      cell.textContent!.trim(),
    );
    expect(cells.slice(1)).toEqual([
      '7',
      '1',
      'payments-1.dat',
      'NatWest',
      '£123.45',
      'BU Beta',
      'original.operator',
      '22 September 2026 at 14:31',
    ]);
    expect(element().querySelector('th button')).toBeNull();
    expect(element().querySelector('a')).toBeNull();
  });

  it('selects same-number tills independently by their ID with accessible labels', () => {
    render(data());
    expect(checkbox('fines-api-allocate-till-101').getAttribute('aria-label')).toBe('Select till 7 for BU Alpha');
    expect(checkbox('fines-api-allocate-till-102').getAttribute('aria-label')).toBe('Select till 7 for BU Beta');
    expect(selectedText()).toBe('0 of 2 tills selected.');
    click('fines-api-allocate-till-102');
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(false);
    expect(checkbox('fines-api-allocate-till-102').checked).toBe(true);
    expect(checkbox('fines-api-allocate-select-all').indeterminate).toBe(true);
    expect(selectedText()).toBe('1 of 2 tills selected.');
    click('fines-api-allocate-till-102');
    expect(selectedText()).toBe('0 of 2 tills selected.');
    expect(checkbox('fines-api-allocate-select-all').indeterminate).toBe(false);
  });

  it('selects and clears all rows, including more than a Process page', () => {
    render(data(rows(26)));
    expect(element().querySelectorAll('tbody tr')).toHaveLength(26);
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-select-all');
    expect(selectedText()).toBe('26 of 26 tills selected.');
    expect(checkbox('fines-api-allocate-select-all').checked).toBe(true);
    expect(checkbox('fines-api-allocate-select-all').indeterminate).toBe(false);
    expect(
      Array.from(element().querySelectorAll<HTMLInputElement>('tbody input')).every((input) => input.checked),
    ).toBe(true);
    click('fines-api-allocate-select-all');
    expect(selectedText()).toBe('0 of 26 tills selected.');
    expect(
      Array.from(element().querySelectorAll<HTMLInputElement>('tbody input')).every((input) => !input.checked),
    ).toBe(true);
  });

  it('updates the header when all individual rows become selected', () => {
    render(data());
    click('fines-api-allocate-till-101');
    click('fines-api-allocate-till-102');
    expect(checkbox('fines-api-allocate-select-all').checked).toBe(true);
    expect(selectedText()).toBe('2 of 2 tills selected.');
    click('fines-api-allocate-till-101');
    expect(checkbox('fines-api-allocate-select-all').checked).toBe(false);
    expect(checkbox('fines-api-allocate-select-all').indeterminate).toBe(true);
  });

  it('announces the selected count politely', () => {
    render(data());
    const output = element().querySelector('output#fines-api-allocate-selected-count')!;
    expect(output.getAttribute('aria-live')).toBe('polite');
    expect(output.getAttribute('aria-atomic')).toBe('true');
  });

  it('clears selections before requesting refresh', () => {
    render(data());
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

  it('clears selections when a new response has the same row IDs', () => {
    render(data());
    click('fines-api-allocate-till-101');
    render(data());
    expect(selectedText()).toBe('0 of 2 tills selected.');
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(false);
    expect(checkbox('fines-api-allocate-select-all').indeterminate).toBe(false);
  });

  it('clears selections across empty and replacement datasets', () => {
    render(data());
    click('fines-api-allocate-select-all');
    render(data([]));
    render(data(rows(1)));
    expect(selectedText()).toBe('0 of 1 tills selected.');
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(false);
    expect(element().querySelector('#fines-api-allocate-till-102')).toBeNull();
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
