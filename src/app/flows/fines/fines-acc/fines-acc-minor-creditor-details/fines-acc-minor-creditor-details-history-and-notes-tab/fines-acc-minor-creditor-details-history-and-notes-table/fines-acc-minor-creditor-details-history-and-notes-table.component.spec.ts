import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-display.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS } from '../../../fines-account-history-table/constants/fines-account-history-table-sort-directions.constant';
import { FinesAccountHistoryTableComponent } from '../../../fines-account-history-table/fines-account-history-table.component';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../routing/constants/fines-acc-routing-paths.constant';
import { FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent } from './fines-acc-minor-creditor-details-history-and-notes-table.component';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY } from './constants/fines-acc-minor-creditor-details-history-and-notes-table-display.constant';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_ACCOUNT_LINK_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-account-link.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_BRANCH_TAB_DATA_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-branch-tab-data.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_INVALID_ACCOUNT_LINK_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-invalid-account-link.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_MAP_TAB_DATA_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-map-tab-data.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_RENDER_TAB_DATA_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-render-tab-data.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_UNSUPPORTED_LINK_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-table-unsupported-link.mock';

const normalizedText = (element: Element): string => element.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent', () => {
  let component: FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tabData', { version: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should map minor creditor account history items to shared history table rows', () => {
    const rows = component.getHistoryRows(
      structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_MAP_TAB_DATA_MOCK),
    );

    expect(rows).toEqual([
      expect.objectContaining({
        id: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`,
        Date: Date.parse('2026-06-25T00:00:00.000Z'),
        displayDate: Date.parse('2026-06-25T00:00:00.000Z'),
        User: 'Case worker',
        Type: 'Payment',
        Details: 'Payment reversed - Account 123',
        Amount: -25,
        absoluteAmount: 25,
        amountAriaId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
        amountDescription: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
        amountTag: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
      }),
    ]);
  });

  it('should preserve API timestamp values including milliseconds as date sort values', () => {
    const timestamp = '2026-06-25T10:30:15.123Z';
    const rows = component.getHistoryRows({
      version: null,
      historyItems: [
        {
          details: {
            line1: [{ fragments: [{ text: 'Timestamped item', bold: false, hyphen: false }] }],
            line2: null,
          },
          postedDetails: {
            posted_by_name: 'Case worker',
            posted_date: timestamp,
          },
          type: 'Notes',
        },
      ],
    });

    expect(rows[0]).toEqual(
      expect.objectContaining({
        Date: Date.parse(timestamp),
        displayDate: Date.parse(timestamp),
      }),
    );
  });

  it('should map supported minor creditor date field paths', () => {
    const timestamp = '2026-06-25T10:30:15.123Z';
    const rows = component.getHistoryRows({
      version: null,
      historyItems: [
        {
          details: {
            line1: [{ fragments: [{ text: 'Posted date item', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '24/06/2026',
        },
        {
          details: {
            line1: [{ fragments: [{ text: 'Timestamp item', bold: false, hyphen: false }] }],
            line2: null,
          },
          timestamp,
        },
      ],
    });

    expect(rows.map((row) => row.Date)).toEqual([Date.parse('2026-06-24T00:00:00.000Z'), Date.parse(timestamp)]);
  });

  it('should map minor creditor history items from the existing API history_items key', () => {
    const tabData = structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_MAP_TAB_DATA_MOCK);
    tabData['history_items'] = tabData['historyItems'];
    delete tabData['historyItems'];

    const rows = component.getHistoryRows(tabData);

    expect(rows).toEqual([
      expect.objectContaining({
        id: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`,
        User: 'Case worker',
        Type: 'Payment',
        Details: 'Payment reversed - Account 123',
      }),
    ]);
  });

  it('should map optional history item fields and amount branches to shared table rows', () => {
    const rows = component.getHistoryRows(
      structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_BRANCH_TAB_DATA_MOCK),
    );

    expect(rows).toEqual([
      expect.objectContaining({
        Date: 1234567890,
        displayDate: 1234567890,
        User: '12345',
        Type: '67890',
        Details: 'First Second Line 2',
        Amount: 10,
        absoluteAmount: 10,
        amountDescription: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit,
        amountTag: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit,
        details: expect.objectContaining({
          line2: expect.any(Array),
        }),
      }),
      expect.objectContaining({
        Date: null,
        displayDate: null,
        User: null,
        Type: null,
        Details: 'Credit detail',
        Amount: 15.5,
        absoluteAmount: 15.5,
        amountDescription: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit,
        amountTag: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit,
        details: expect.objectContaining({
          line1: expect.any(Array),
        }),
      }),
      expect.objectContaining({
        Date: null,
        displayDate: null,
        Details: '',
        Amount: 0,
        absoluteAmount: 0,
        amountDescription: null,
        amountTag: null,
        details: null,
      }),
      expect.objectContaining({
        Date: null,
        displayDate: null,
        Details: '',
        Amount: null,
        absoluteAmount: null,
        amountDescription: null,
        amountTag: null,
        details: null,
      }),
    ]);
  });

  it('should render the shared history table with mapped rows', () => {
    fixture.componentRef.setInput(
      'tabData',
      structuredClone(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_RENDER_TAB_DATA_MOCK),
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('25 Jun 2026');
    expect(fixture.nativeElement.textContent).toContain('Finance officer');
    expect(fixture.nativeElement.textContent).toContain('Payment received');
    expect(fixture.nativeElement.textContent).toContain('CR');
  });

  it('should render minor creditor CR and DR amounts with accessible descriptions', () => {
    fixture.componentRef.setInput('tabData', {
      version: null,
      historyItems: [
        {
          amount: 50,
          details: {
            line1: [{ fragments: [{ text: 'Credited payment', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '25/06/2026',
          type: 'Financial',
        },
        {
          amount: -25,
          details: {
            line1: [{ fragments: [{ text: 'Debited payment', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '24/06/2026',
          type: 'Financial',
        },
        {
          amount: 0,
          details: {
            line1: [{ fragments: [{ text: 'Zero amount', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '23/06/2026',
          type: 'Financial',
        },
        {
          details: {
            line1: [{ fragments: [{ text: 'Note without amount', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '22/06/2026',
          type: 'Notes',
        },
      ],
    });

    fixture.detectChanges();

    const creditCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}0`,
    ) as HTMLTableCellElement;
    const debitCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}1`,
    ) as HTMLTableCellElement;
    const zeroCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}2`,
    ) as HTMLTableCellElement;
    const emptyCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.amount}3`,
    ) as HTMLTableCellElement;
    const creditTag = creditCell.querySelector('strong') as HTMLElement;
    const debitTag = debitCell.querySelector('strong') as HTMLElement;
    const creditAmountDescriptionId = `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`;
    const debitAmountDescriptionId = `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`;

    expect(normalizedText(creditCell)).toContain('£50.00 CR credited');
    expect(creditTag.classList).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTag);
    expect(creditTag.classList).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTagCredit);
    expect(creditTag.getAttribute('aria-describedby')).toBe(creditAmountDescriptionId);
    expect(creditTag.getAttribute('tabindex')).toBeNull();
    expect(creditCell.querySelector(`#${creditAmountDescriptionId}`)?.textContent).toContain(
      FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit,
    );

    expect(normalizedText(debitCell)).toContain('£25.00 DR debited');
    expect(debitTag.classList).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTag);
    expect(debitTag.classList).toContain(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.cssClasses.amountTagDebit);
    expect(debitTag.getAttribute('aria-describedby')).toBe(debitAmountDescriptionId);
    expect(debitTag.getAttribute('tabindex')).toBeNull();
    expect(debitCell.querySelector(`#${debitAmountDescriptionId}`)?.textContent).toContain(
      FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
    );

    expect(normalizedText(zeroCell)).toBe(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.emptyCell);
    expect(zeroCell.querySelector('strong')).toBeNull();
    expect(normalizedText(emptyCell)).toBe(FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.emptyCell);
    expect(emptyCell.querySelector('strong')).toBeNull();
  });

  it('should render minor creditor details pipes, hyphens, bold fragments, links, and line2', () => {
    fixture.componentRef.setInput('tabData', {
      version: null,
      historyItems: [
        {
          details: {
            line1: [
              {
                fragments: [{ text: 'Repayment', bold: false, hyphen: false }],
              },
              {
                fragments: [
                  { text: 'Defendant account:', bold: false, hyphen: false },
                  {
                    text: '250000123M',
                    bold: true,
                    hyphen: true,
                    link: {
                      emit: '12345',
                      type: 'account',
                    },
                  },
                ],
              },
            ],
            line2: [{ fragments: [{ text: 'Additional repayment note', bold: false, hyphen: false }] }],
          },
          posted_date: '25/06/2026',
          posted_by_name: 'Finance officer',
          type: 'Financial',
        },
      ],
    });

    fixture.detectChanges();

    const detailsCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.details}0`,
    ) as HTMLTableCellElement;
    const accountLink = detailsCell.querySelector('a') as HTMLAnchorElement;
    const boldFragment = detailsCell.querySelector('strong') as HTMLElement;

    expect(normalizedText(detailsCell)).toContain('Repayment | Defendant account: - 250000123M');
    expect(normalizedText(detailsCell)).toContain('Additional repayment note');
    expect(accountLink.textContent).toContain('250000123M');
    expect(boldFragment.textContent).toContain('250000123M');
  });

  it('should render minor creditor rows in default newest-to-oldest date order', () => {
    fixture.componentRef.setInput('tabData', {
      version: null,
      historyItems: [
        {
          details: {
            line1: [{ fragments: [{ text: 'Older item', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '24/06/2026',
          posted_by_name: 'Older user',
          type: 'Notes',
        },
        {
          details: {
            line1: [{ fragments: [{ text: 'Newer item', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '25/06/2026',
          posted_by_name: 'Newer user',
          type: 'Notes',
        },
      ],
    });

    fixture.detectChanges();

    const firstUserCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.user}0`,
    ) as HTMLTableCellElement;

    expect(firstUserCell.textContent).toContain('Newer user');
  });

  it('should sort minor creditor rows by date ascending when the date sort changes', () => {
    fixture.componentRef.setInput('tabData', {
      version: null,
      historyItems: [
        {
          details: {
            line1: [{ fragments: [{ text: 'Newer item', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '25/06/2026',
          posted_by_name: 'Newer user',
          type: 'Notes',
        },
        {
          details: {
            line1: [{ fragments: [{ text: 'Older item', bold: false, hyphen: false }] }],
            line2: null,
          },
          posted_date: '24/06/2026',
          posted_by_name: 'Older user',
          type: 'Notes',
        },
      ],
    });
    fixture.detectChanges();

    const historyTable = fixture.debugElement.query(By.directive(FinesAccountHistoryTableComponent))
      .componentInstance as FinesAccountHistoryTableComponent;
    historyTable.onSortChange({
      key: 'Date',
      sortType: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.ascending,
    });
    fixture.detectChanges();

    const firstUserCell = fixture.nativeElement.querySelector(
      `#${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefixes.user}0`,
    ) as HTMLTableCellElement;

    expect(firstUserCell.textContent).toContain('Older user');
  });

  it('should open account history links in a new browser tab', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const accountId = FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_ACCOUNT_LINK_MOCK.emit;
    const expectedUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/${accountId}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

    fixture.detectChanges();
    component.handleHistoryLinkClicked(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_ACCOUNT_LINK_MOCK);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expectedUrl,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_DISPLAY.windowTarget,
    );
  });

  it('should ignore unsupported history link types', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.handleHistoryLinkClicked(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_UNSUPPORTED_LINK_MOCK);

    expect(windowOpenSpy).not.toHaveBeenCalled();
  });

  it('should ignore account history links without a finite account id', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.handleHistoryLinkClicked(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TABLE_INVALID_ACCOUNT_LINK_MOCK,
    );

    expect(windowOpenSpy).not.toHaveBeenCalled();
  });
});
