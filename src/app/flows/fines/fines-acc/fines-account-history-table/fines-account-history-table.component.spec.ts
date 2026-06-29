import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSortableTableComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-sortable-table';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT } from './constants/fines-account-history-table-default-sort.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from './constants/fines-account-history-table-display.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS } from './constants/fines-account-history-table-sort-directions.constant';
import { FinesAccountHistoryTableComponent } from './fines-account-history-table.component';
import { IFinesAccountHistoryTableRow } from './interfaces/fines-account-history-table-row.interface';
import { FINES_ACCOUNT_HISTORY_TABLE_LINK_CLICK_MOCK } from './mocks/fines-account-history-table-link-click.mock';
import { FINES_ACCOUNT_HISTORY_TABLE_ROWS_MOCK } from './mocks/fines-account-history-table-rows.mock';
import { FINES_ACCOUNT_HISTORY_TABLE_SPACING_ROWS_MOCK } from './mocks/fines-account-history-table-spacing-rows.mock';
import { FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK } from './mocks/fines-account-history-table-sort-edge-rows.mock';

const normalizedText = (element: Element): string => element.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('FinesAccountHistoryTableComponent', () => {
  let fixture: ComponentFixture<FinesAccountHistoryTableComponent>;
  let component: FinesAccountHistoryTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccountHistoryTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccountHistoryTableComponent);
    component = fixture.componentInstance;
  });

  const setupComponent = (
    rows: IFinesAccountHistoryTableRow[] | null = structuredClone(FINES_ACCOUNT_HISTORY_TABLE_ROWS_MOCK),
  ): ComponentFixture<FinesAccountHistoryTableComponent> => {
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    return fixture;
  };

  it('should create', () => {
    setupComponent();

    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(AbstractSortableTableComponent);
  });

  it('should render rows in default newest-to-oldest order using UTC timestamp milliseconds', () => {
    setupComponent();

    const firstDateCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.date}0`,
    ) as HTMLTableCellElement;
    const firstUserCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.user}0`,
    ) as HTMLTableCellElement;
    const firstDetailsCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}0`,
    ) as HTMLTableCellElement;

    expect(firstDateCell.textContent).toContain('12 Mar 2025');
    expect(firstUserCell.textContent).toContain('Finance officer');
    expect(firstDetailsCell.textContent).toContain('Account consolidated');
    expect(firstDetailsCell.textContent).toContain('2500000BV');
  });

  it('should sort by date ascending when the date sort changes', () => {
    setupComponent();

    component.onSortChange({
      key: FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column,
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });
    fixture.detectChanges();

    const firstUserCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.user}0`,
    ) as HTMLTableCellElement;

    expect(component.sortedColumnTitleSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column);
    expect(component.sortedColumnDirectionSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending);
    expect(firstUserCell.textContent).toContain('Notes user');
  });

  it('should sort null dates after populated dates and preserve equal null order', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK));

    component.onSortChange({
      key: 'Date',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });

    expect(component.sortedRows().map((row) => row.id)).toEqual([
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-3`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-1`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-0`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-2`,
    ]);
  });

  it('should keep null dates after populated dates when sorting descending', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK));

    expect(component.sortedRows().map((row) => row.id)).toEqual([
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-1`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-3`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-0`,
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}sort-2`,
    ]);
  });

  it('should sort numeric amounts before null amounts', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK));

    component.onSortChange({
      key: 'Amount',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });

    expect(component.sortedRows().map((row) => row.Amount)).toEqual([-5, 0, 20, null]);
  });

  it('should sort string values using the common sortable table ordering before null values', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK));

    component.onSortChange({
      key: 'User',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });

    expect(component.sortedRows().map((row) => row.User)).toEqual(['User 10', 'User 2', 'alpha', null]);
  });

  it('should ignore sort changes with unsupported columns or none direction', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SORT_EDGE_ROWS_MOCK));

    component.onSortChange({
      key: 'Unsupported',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });

    expect(component.sortedColumnTitleSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column);
    expect(component.sortedColumnDirectionSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.direction);

    component.onSortChange({
      key: 'User',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.none,
    });

    expect(component.sortedColumnTitleSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.column);
    expect(component.sortedColumnDirectionSignal()).toBe(FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT.direction);
  });

  it('should render details pipes, hyphens, bold fragments, links, and line2', () => {
    setupComponent();

    const detailsCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}0`,
    ) as HTMLTableCellElement;
    const accountLink = detailsCell.querySelector('a') as HTMLAnchorElement;
    const boldFragment = detailsCell.querySelector('strong') as HTMLElement;

    expect(normalizedText(detailsCell)).toContain('Account consolidated');
    expect(normalizedText(detailsCell)).toContain('|');
    expect(normalizedText(detailsCell)).toContain('- 2500000BV');
    expect(normalizedText(detailsCell)).toContain('Amount credited to master account');
    expect(normalizedText(detailsCell)).toContain('Consolidated following review');
    expect(accountLink.textContent).toContain('2500000BV');
    expect(boldFragment.textContent).toContain('2500000BV');
  });

  it('should render spaces between adjacent details fragments', () => {
    setupComponent(structuredClone(FINES_ACCOUNT_HISTORY_TABLE_SPACING_ROWS_MOCK));

    const paymentTermsDetailsCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}0`,
    ) as HTMLTableCellElement;
    const enforcementDetailsCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}1`,
    ) as HTMLTableCellElement;

    expect(normalizedText(paymentTermsDetailsCell)).toContain('Instalments: £300.00 weekly from 25/06/2026');
    expect(normalizedText(paymentTermsDetailsCell)).not.toContain('Instalments:£300.00weekly from25/06/2026');
    expect(normalizedText(enforcementDetailsCell)).toContain('FSN | Warrant number: 004/25/00007');
    expect(normalizedText(enforcementDetailsCell)).not.toContain('Warrant number:004/25/00007');
  });

  it('should emit link metadata when a details link is clicked', () => {
    const emitSpy = vi.spyOn(component.historyLinkClicked, 'emit');
    setupComponent();

    const accountLink = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}0 a`,
    ) as HTMLAnchorElement;
    accountLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(emitSpy).toHaveBeenCalledWith(FINES_ACCOUNT_HISTORY_TABLE_LINK_CLICK_MOCK);
  });

  it('should render CR and DR amount tags with screen-reader descriptions', () => {
    setupComponent();

    const creditCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}0`,
    ) as HTMLTableCellElement;
    const debitCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}1`,
    ) as HTMLTableCellElement;

    expect(creditCell.textContent).toContain('£50.00');
    expect(creditCell.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit);
    expect(creditCell.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit);
    expect(creditCell.querySelector(`.${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTagCredit}`)).toBeTruthy();
    expect(creditCell.querySelector('strong')?.getAttribute('aria-describedby')).toBe(
      `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
    );

    expect(debitCell.textContent).toContain('£25.00');
    expect(debitCell.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit);
    expect(debitCell.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit);
    expect(debitCell.querySelector(`.${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTagDebit}`)).toBeTruthy();
  });

  it('should render no results when there are no history items', () => {
    setupComponent([]);

    expect(fixture.nativeElement.querySelector('opal-lib-moj-sortable-table')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.noResultsText);
  });

  it('should render no results when rows input is null', () => {
    setupComponent(null);

    expect(component.sortedRows()).toEqual([]);
    expect(fixture.nativeElement.querySelector('opal-lib-moj-sortable-table')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.noResultsText);
  });
});
