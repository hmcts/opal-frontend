import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccDefendantDetailsHistoryAndNotesTabComponent } from './fines-acc-defendant-details-history-and-notes-tab.component';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.mock';
import { of } from 'rxjs';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from './mocks/fines-acc-defendant-details-history-and-notes-filter-form.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK } from './mocks/fines-acc-defendant-details-history-and-notes-filter-form-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK } from './mocks/fines-acc-defendant-details-history-and-notes-account-id.mock';
import { FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK } from './mocks/fines-acc-defendant-details-history-and-notes-filtered-tab-data.mock';
import { IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-defendant-details-history-and-notes-tab-ref-data.interface';
import { TFinesAccHistoryAndNotesRawItem } from '../../services/utils/types/fines-acc-history-and-notes-raw-item.type';

type FinesAccDefendantDetailsHistoryAndNotesTabPrivateMethods = {
  getHistoryItems(
    tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData,
  ): TFinesAccHistoryAndNotesRawItem[];
  isHistoryItem(value: unknown): value is TFinesAccHistoryAndNotesRawItem;
};

describe('FinesAccDefendantDetailsHistoryAndNotesTabComponent', () => {
  let component: FinesAccDefendantDetailsHistoryAndNotesTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsHistoryAndNotesTabComponent>;
  let privateComponent: FinesAccDefendantDetailsHistoryAndNotesTabPrivateMethods;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      getDefendantAccountHistoryAndNotesTabData: vi
        .fn()
        .mockName('OpalFines.getDefendantAccountHistoryAndNotesTabData'),
    };
    mockPayloadService = {
      buildHistoryFilterPayload: vi.fn().mockName('FinesAccPayloadService.buildHistoryFilterPayload'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
      transformHistoryAndNotesItems: vi.fn().mockName('FinesAccPayloadService.transformHistoryAndNotesItems'),
    };
    mockAccountStore = {
      compareVersion: vi.fn().mockName('FinesAccountStore.compareVersion'),
    };

    mockPayloadService.buildHistoryFilterPayload.mockReturnValue(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    mockPayloadService.transformPayload.mockImplementation((data: unknown) => data);
    mockPayloadService.transformHistoryAndNotesItems.mockImplementation((items: Record<string, unknown>[]) =>
      items.map((item) => ({
        ...item,
        details: { line1: [{ fragments: [{ text: 'Transformed detail', bold: false, hyphen: false }] }], line2: null },
      })),
    );
    mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
    );

    await TestBed.configureTestingModule({
      imports: [FinesAccDefendantDetailsHistoryAndNotesTabComponent],
      providers: [
        provideRouter([]),
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
        { provide: FinesAccountStore, useValue: mockAccountStore },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('details'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccDefendantDetailsHistoryAndNotesTabComponent);
    component = fixture.componentInstance;
    privateComponent = component as unknown as FinesAccDefendantDetailsHistoryAndNotesTabPrivateMethods;
    component.accountId = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK;
    component.tabData$ = of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should use the parent-provided tab data stream', () => {
    const emitted: unknown[] = [];

    fixture.detectChanges();
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(emitted).toEqual([OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK]);
  });

  it('should rebind the display stream when parent tab data stream changes', () => {
    const refreshedTabData = { version: 'refreshed-version' };
    const emitted: unknown[] = [];

    fixture.detectChanges();
    component.tabData$ = of(refreshedTabData);
    component.ngOnChanges({
      tabData$: new SimpleChange(
        of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
        component.tabData$,
        false,
      ),
    });
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(emitted).toEqual([
      OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      refreshedTabData,
    ]);
  });

  it('should not rebind the display stream on the first parent tab data change', () => {
    const initialDisplayStream = component.historyAndNotesTabData$;

    component.tabData$ = of({ version: 'initial-version' });
    component.ngOnChanges({
      tabData$: new SimpleChange(undefined, component.tabData$, true),
    });

    expect(component.historyAndNotesTabData$).toBe(initialDisplayStream);
  });

  it('should ignore unrelated input changes', () => {
    const initialDisplayStream = component.historyAndNotesTabData$;

    component.ngOnChanges({});

    expect(component.historyAndNotesTabData$).toBe(initialDisplayStream);
  });

  it('should fetch filtered tab data and keep the filter open when filter values are applied', () => {
    const emitted: unknown[] = [];
    mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData.mockReturnValue(
      of(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK),
    );

    fixture.detectChanges();
    component.historyAndNotesTabData$.subscribe();
    component.handleFilterApplied(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(component.filterForm).toEqual(FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    expect(component.filterOpen).toBe(true);
    expect(mockPayloadService.buildHistoryFilterPayload).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK,
    );
    expect(mockOpalFinesService.getDefendantAccountHistoryAndNotesTabData).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK,
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK,
      expect.any(Array),
    );
    expect(mockAccountStore.compareVersion).toHaveBeenCalledWith(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK.version,
    );
    expect(emitted).toEqual([
      OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK,
    ]);
  });

  it('should extract valid history items from the first recognised history item array', () => {
    const validHistoryItem = { id: 1, type: 'Note' };
    const otherValidHistoryItem = { id: 2, type: 'Payment' };
    const laterHistoryItem = { id: 3, type: 'Ignored because history_items is first' };
    const tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData = {
      version: 'test-version',
      history_items: [validHistoryItem, null, undefined, 'ignored', 10, false, otherValidHistoryItem],
      historyItems: [laterHistoryItem],
    };

    const result = privateComponent.getHistoryItems(tabData);

    expect(result).toEqual([validHistoryItem, otherValidHistoryItem]);
  });

  it('should extract history items from the next recognised array when earlier keys are not arrays', () => {
    const validHistoryItem = { id: 1, type: 'Note' };
    const tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData = {
      version: 'test-version',
      history_items: 'not an array',
      historyItems: [validHistoryItem],
    };

    const result = privateComponent.getHistoryItems(tabData);

    expect(result).toEqual([validHistoryItem]);
  });

  it('should return an empty array when tab data has no recognised history item array', () => {
    const tabData: IOpalFinesAccountDefendantDetailsHistoryAndNotesTabRefData = {
      version: 'test-version',
      history_items: 'not an array',
      historyItems: null,
      history: { id: 1 },
      items: 1,
      records: false,
      results: undefined,
    };

    const result = privateComponent.getHistoryItems(tabData);

    expect(result).toEqual([]);
  });

  it('should identify non-null objects as history items', () => {
    expect(privateComponent.isHistoryItem({ id: 1 })).toBe(true);
  });

  it('should reject null and primitive values as history items', () => {
    expect(privateComponent.isHistoryItem(null)).toBe(false);
    expect(privateComponent.isHistoryItem(undefined)).toBe(false);
    expect(privateComponent.isHistoryItem('note')).toBe(false);
    expect(privateComponent.isHistoryItem(1)).toBe(false);
    expect(privateComponent.isHistoryItem(false)).toBe(false);
  });

  it('should store filter open state from the filter component', () => {
    component.handleFilterOpenChange(true);

    expect(component.filterOpen).toBe(true);
  });
});
