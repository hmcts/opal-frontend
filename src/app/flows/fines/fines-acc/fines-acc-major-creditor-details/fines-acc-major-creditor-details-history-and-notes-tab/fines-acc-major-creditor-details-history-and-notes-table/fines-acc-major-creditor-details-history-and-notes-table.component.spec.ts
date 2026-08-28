import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-display.constant';
import { FINES_ACCOUNT_HISTORY_TABLE_MAPPING_DISPLAY } from '../../../fines-account-history-table/constants/fines-account-history-table-mapping-display.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_ROUTING_PATHS } from '../../../routing/constants/fines-acc-routing-paths.constant';
import { FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent } from './fines-acc-major-creditor-details-history-and-notes-table.component';

const HISTORY_TAB_DATA_MOCK = {
  version: null,
  historyItems: [
    {
      amount: -25,
      details: {
        line1: [
          {
            fragments: [
              { text: 'Payment reversed', bold: false, hyphen: false },
              { text: 'Account 123', bold: false, hyphen: true },
            ],
          },
        ],
        line2: null,
      },
      postedDetails: {
        posted_by_name: 'Case worker',
        posted_date: '25/06/2026',
      },
      type: 'Financial',
    },
  ],
};

describe('FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent', () => {
  let component: FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent);
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

  it('should map major creditor history items to shared history table rows', () => {
    const rows = component.historyTableAdapter.getRows(structuredClone(HISTORY_TAB_DATA_MOCK));

    expect(rows).toEqual([
      expect.objectContaining({
        id: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`,
        Date: Date.parse('2026-06-25T00:00:00.000Z'),
        displayDate: Date.parse('2026-06-25T00:00:00.000Z'),
        User: 'Case worker',
        Type: 'Financial',
        Details: 'Payment reversed - Account 123',
        Amount: -25,
        absoluteAmount: 25,
        amountAriaId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDirectionSuffix}`,
        amountDescription: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit,
        amountTag: FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit,
      }),
    ]);
  });

  it('should map major creditor history items supplied with the API history_items key', () => {
    const tabData: Record<string, unknown> = structuredClone(HISTORY_TAB_DATA_MOCK);
    tabData['history_items'] = tabData['historyItems'];
    delete tabData['historyItems'];

    const rows = component.historyTableAdapter.getRows(tabData);

    expect(rows).toEqual([
      expect.objectContaining({
        User: 'Case worker',
        Type: 'Financial',
        Details: 'Payment reversed - Account 123',
      }),
    ]);
  });

  it('should render the shared history table with mapped rows', () => {
    fixture.componentRef.setInput('tabData', structuredClone(HISTORY_TAB_DATA_MOCK));

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('25 Jun 2026');
    expect(fixture.nativeElement.textContent).toContain('Case worker');
    expect(fixture.nativeElement.textContent).toContain('Payment reversed');
    expect(fixture.nativeElement.textContent).toContain('DR');
  });

  it('should open linked defendant account history records in a new browser tab', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const accountId = 12345;
    const expectedUrl = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.children.defendant}/${accountId}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;

    component.historyTableAdapter.openHistoryLink({
      emit: String(accountId),
      rowId: 'history-row-0',
      type: 'account',
    });

    expect(windowOpenSpy).toHaveBeenCalledWith(expectedUrl, FINES_ACCOUNT_HISTORY_TABLE_MAPPING_DISPLAY.windowTarget);
  });

  it('should ignore unsupported and invalid history links', () => {
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.historyTableAdapter.openHistoryLink({
      emit: '12345',
      rowId: 'history-row-0',
      type: 'unsupported',
    });
    component.historyTableAdapter.openHistoryLink({
      emit: 'not-an-account-id',
      rowId: 'history-row-0',
      type: 'account',
    });

    expect(windowOpenSpy).not.toHaveBeenCalled();
  });
});
