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

  it('should preserve RFC3339 UTC timestamps including milliseconds as date sort values', () => {
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
