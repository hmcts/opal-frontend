import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesApiAllocateTillsTableWrapperComponent } from './fines-api-allocate-tills-table-wrapper.component';
import { IFinesApiAllocateData } from '../interfaces/fines-api-allocate-data.interface';
import { IFinesApiAllocateTillsTableWrapperTableData } from './interfaces/fines-api-allocate-tills-table-wrapper-table-data.interface';

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
const data = (tills = rows()): IFinesApiAllocateData => ({ tills, processingTotal: 0, processingByBusinessUnit: [] });

describe('FinesApiAllocateTillsTableWrapperComponent', () => {
  let fixture: ComponentFixture<FinesApiAllocateTillsTableWrapperComponent>;
  const element = (): HTMLElement => fixture.nativeElement;
  const checkbox = (id: string): HTMLInputElement => element().querySelector<HTMLInputElement>(`#${id}`)!;
  const selectedText = (): string => element().querySelector('#fines-api-allocate-selected-count')!.textContent!.trim();
  const render = (value: IFinesApiAllocateData): void => {
    fixture.componentRef.setInput('tableData', value.tills);
    fixture.detectChanges();
  };
  const click = (id: string): void => {
    element().querySelector<HTMLElement>(`#${id}`)!.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesApiAllocateTillsTableWrapperComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(FinesApiAllocateTillsTableWrapperComponent);
  });

  it('renders every mapped column with sortable headers and preserves initial backend order', () => {
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
    expect(element().querySelectorAll('th button')).toHaveLength(8);
  });

  const sortBy = (index: number): void => {
    element().querySelectorAll<HTMLButtonElement>('th button')[index].click();
    fixture.detectChanges();
  };
  const visibleIds = (): string[] =>
    Array.from(element().querySelectorAll<HTMLInputElement>('tbody input'), (input) => input.id);

  it.each([
    [0, 'Till number', 10, 2],
    [1, 'Errors', 10, 2],
    [2, 'Filename', 'zebra.dat', 'alpha.dat'],
    [3, 'Source', 'allpay', 'NatWest'],
    [4, 'Amount', 1000, 20],
    [5, 'Business Unit', 'BU Zebra', 'BU Alpha'],
    [6, 'Processed by', 'z.operator', 'a.operator'],
    [7, 'Date processed', 1790845200000, 1790780400000],
  ] as const)('sorts column %i in both directions and announces its state', (index, field, high, low) => {
    const tills = rows();
    tills[0] = { ...tills[0], [field]: high };
    tills[1] = { ...tills[1], [field]: low };
    render(data(tills));
    click('fines-api-allocate-till-101');
    sortBy(index);
    expect(visibleIds()).toEqual(['fines-api-allocate-till-102', 'fines-api-allocate-till-101']);
    expect(element().querySelectorAll('thead th')[index + 1].getAttribute('aria-sort')).toBe('ascending');
    expect(element().querySelector('opal-lib-moj-sortable-table-status')!.textContent).toContain('ascending');
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(true);
    expect(selectedText()).toBe('1 of 2 tills selected.');
    sortBy(index);
    expect(visibleIds()).toEqual(['fines-api-allocate-till-101', 'fines-api-allocate-till-102']);
    expect(element().querySelectorAll('thead th')[index + 1].getAttribute('aria-sort')).toBe('descending');
    expect(tills.map((row) => row.tillId)).toEqual(['101', '102']);
  });

  it('sorts raw numeric amounts using the shared sorter', () => {
    const tills = rows(3);
    [1000, 20, -1].forEach((amount, index) => (tills[index].Amount = amount));
    render(data(tills));
    sortBy(4);
    expect(visibleIds()).toEqual([103, 102, 101].map((id) => `fines-api-allocate-till-${id}`));
    sortBy(4);
    expect(visibleIds()).toEqual([101, 102, 103].map((id) => `fines-api-allocate-till-${id}`));
  });

  it.each([
    [0, '£0.00'],
    [1234, '£1,234.00'],
    [1234.5, '£1,234.50'],
  ])('renders amount %s using the shared monetary formatter', (amount, expected) => {
    render(data([{ ...rows(1)[0], Amount: amount }]));
    const monetary = element().querySelector('opal-lib-custom-accessible-monetary')!;
    expect(monetary.textContent!.trim()).toBe(expected);
  });

  it('provides an accessible spoken value for negative amounts', () => {
    render(data([{ ...rows(1)[0], Amount: -20 }]));
    const monetary = element().querySelector('opal-lib-custom-accessible-monetary')!;
    expect(monetary.querySelector('[aria-hidden="true"]')!.textContent).toBe('-£20.00');
    expect(monetary.querySelector('.govuk-visually-hidden')!.textContent).toBe('minus £20.00');
  });

  it('changes the active column and restores backend order for replacement rows', () => {
    render(data());
    sortBy(2);
    sortBy(5);
    expect(element().querySelectorAll('thead th')[3].getAttribute('aria-sort')).toBe('none');
    render(data(rows().reverse()));
    expect(visibleIds()).toEqual(['fines-api-allocate-till-102', 'fines-api-allocate-till-101']);
    expect(element().querySelectorAll('thead th')[6].getAttribute('aria-sort')).toBe('none');
    click('fines-api-allocate-select-all');
    expect(selectedText()).toBe('2 of 2 tills selected.');
  });

  it('links same-number tills to distinct summary URLs using their internal IDs', () => {
    render(data());
    const links = Array.from(element().querySelectorAll<HTMLAnchorElement>('tbody a'));
    expect(links.map((link) => link.textContent!.trim())).toEqual(['7', '7']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/fines/auto-payment-in/till-summary/101',
      '/fines/auto-payment-in/till-summary/102',
    ]);
  });

  it('requests the clicked till summary without changing the checkbox selection', async () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    render(data());
    click('fines-api-allocate-till-101');
    element().querySelectorAll<HTMLAnchorElement>('tbody a')[1].click();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledOnce();
    expect(router.serializeUrl(navigate.mock.calls[0][0] as UrlTree)).toBe('/fines/auto-payment-in/till-summary/102');
    expect(selectedText()).toBe('1 of 2 tills selected.');
    expect(checkbox('fines-api-allocate-till-101').checked).toBe(true);
    expect(checkbox('fines-api-allocate-till-102').checked).toBe(false);
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
});
