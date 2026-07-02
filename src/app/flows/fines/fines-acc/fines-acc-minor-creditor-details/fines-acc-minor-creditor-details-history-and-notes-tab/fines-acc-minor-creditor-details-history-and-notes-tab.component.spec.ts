import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent } from './fines-acc-minor-creditor-details-history-and-notes-tab.component';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.mock';
import { Subject, of } from 'rxjs';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-filter-form.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-filter-form-payload.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-account-id.mock';
import { FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK } from './mocks/fines-acc-minor-creditor-details-history-and-notes-filtered-tab-data.mock';
import { IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-minor-creditor-details-history-and-notes-tab-ref-data.interface';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG } from '../../services/constants/fines-acc-minor-creditor-history-and-notes-details-transformation-config.constant';
import { THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent } from './fines-acc-minor-creditor-details-history-and-notes-table/fines-acc-minor-creditor-details-history-and-notes-table.component';
import { FinesAccMinorCreditorDetailsHistoryAndNotesFilterComponent } from './fines-acc-minor-creditor-details-history-and-notes-filter/fines-acc-minor-creditor-details-history-and-notes-filter.component';

describe('FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent', () => {
  let component: FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent;
  let fixture: ComponentFixture<FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;
  const baseHistoryItems = OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK[
    'history_items'
  ] as TFinesAccHistoryAndNotesRawItem[];
  const transformedBaseTabData = {
    ...OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
    history_items: baseHistoryItems.map((item) => ({
      ...item,
      details: { line1: [{ fragments: [{ text: 'Transformed detail', bold: false, hyphen: false }] }], line2: null },
    })),
  };
  const getRenderedFilterComponent = (): FinesAccMinorCreditorDetailsHistoryAndNotesFilterComponent =>
    fixture.debugElement.query(By.directive(FinesAccMinorCreditorDetailsHistoryAndNotesFilterComponent))
      .componentInstance as FinesAccMinorCreditorDetailsHistoryAndNotesFilterComponent;
  const getRenderedTableComponent = (): FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent =>
    fixture.debugElement.query(By.directive(FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent))
      .componentInstance as FinesAccMinorCreditorDetailsHistoryAndNotesTableComponent;

  beforeEach(async () => {
    mockOpalFinesService = {
      getMinorCreditorAccountHistoryAndNotesTabData: vi
        .fn()
        .mockName('OpalFines.getMinorCreditorAccountHistoryAndNotesTabData'),
    };
    mockPayloadService = {
      buildMinorCreditorHistoryFilterPayload: vi
        .fn()
        .mockName('FinesAccPayloadService.buildMinorCreditorHistoryFilterPayload'),
      transformPayload: vi.fn().mockName('FinesAccPayloadService.transformPayload'),
      transformHistoryAndNotesItems: vi.fn().mockName('FinesAccPayloadService.transformHistoryAndNotesItems'),
    };
    mockAccountStore = {
      compareVersion: vi.fn().mockName('FinesAccountStore.compareVersion'),
    };

    mockPayloadService.buildMinorCreditorHistoryFilterPayload.mockReturnValue(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    mockPayloadService.transformPayload.mockImplementation((data: unknown) => data);
    mockPayloadService.transformHistoryAndNotesItems.mockImplementation((items: Record<string, unknown>[]) =>
      items.map((item) => ({
        ...item,
        details: { line1: [{ fragments: [{ text: 'Transformed detail', bold: false, hyphen: false }] }], line2: null },
      })),
    );
    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
    );

    await TestBed.configureTestingModule({
      imports: [FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent],
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

    fixture = TestBed.createComponent(FinesAccMinorCreditorDetailsHistoryAndNotesTabComponent);
    component = fixture.componentInstance;
    component.accountId = FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK;
    component.tabData$ = of(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
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

    expect(emitted).toEqual([transformedBaseTabData]);
  });

  it('should render the history and notes table with transformed tab data', () => {
    fixture.detectChanges();

    const historyTable = getRenderedTableComponent();

    expect(historyTable).toBeTruthy();
    expect(historyTable.tabData).toEqual(transformedBaseTabData);
  });

  it('should rebind the display stream when parent tab data stream changes', () => {
    const refreshedTabData = { version: 'refreshed-version' };
    const emitted: unknown[] = [];

    fixture.detectChanges();
    component.historyAndNotesTabData$.subscribe();
    component.tabData$ = of(refreshedTabData);
    component.ngOnChanges({
      tabData$: new SimpleChange(
        of(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
        component.tabData$,
        false,
      ),
    });
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(emitted).toEqual([transformedBaseTabData, refreshedTabData]);
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
    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK),
    );

    fixture.detectChanges();
    component.historyAndNotesTabData$.subscribe();
    component.handleFilterApplied(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(component.filterForm).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    expect(component.filterOpen).toBe(true);
    expect(mockPayloadService.buildMinorCreditorHistoryFilterPayload).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK,
    );
    expect(mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK,
      expect.any(Array),
    );
    expect(mockAccountStore.compareVersion).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK.version,
    );
    expect(emitted).toEqual([
      transformedBaseTabData,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK,
    ]);
  });

  it('should fetch filtered tab data only when the rendered filter component applies filter values', () => {
    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(
      of(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK),
    );

    fixture.detectChanges();

    const filterComponent = getRenderedFilterComponent();

    expect(mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData).not.toHaveBeenCalled();

    filterComponent.filterApplied.emit(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    fixture.detectChanges();

    expect(mockPayloadService.buildMinorCreditorHistoryFilterPayload).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK,
    );
    expect(mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData).toHaveBeenCalledWith(
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK,
      FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    expect(filterComponent.filterForm).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    expect(filterComponent.filterOpen).toBe(true);
  });

  it('should keep the existing table rows while a filtered request is pending', () => {
    const filteredTabData$ = new Subject<IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData>();
    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(filteredTabData$);

    fixture.detectChanges();

    const filterComponent = getRenderedFilterComponent();

    filterComponent.filterApplied.emit(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    fixture.detectChanges();

    const historyTable = getRenderedTableComponent();

    expect(historyTable.tabData).toEqual(transformedBaseTabData);

    filteredTabData$.next(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK);
    filteredTabData$.complete();
    fixture.detectChanges();

    expect(historyTable.tabData).toEqual(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTERED_TAB_DATA_MOCK);
  });

  it('should transform filtered history items into the history and notes details format', () => {
    const emitted: unknown[] = [];
    const validHistoryItem = { id: 1, type: 'Note', details: { note_text: 'Original detail' } };
    const transformedHistoryItem = {
      ...validHistoryItem,
      details: { line1: [{ fragments: [{ text: 'Transformed detail', bold: false, hyphen: false }] }], line2: null },
    };
    const filteredTabData: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData = {
      version: 'filtered-version',
      history_items: [validHistoryItem, null, 'ignored'],
    };

    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(of(filteredTabData));

    component.handleFilterApplied(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      [validHistoryItem],
      FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
    expect(emitted).toEqual([
      {
        version: 'filtered-version',
        history_items: [transformedHistoryItem],
      },
    ]);
  });

  it('should transform the next recognised history item array when earlier keys are not arrays', () => {
    const emitted: unknown[] = [];
    const validHistoryItem = { id: 1, type: 'Note' };
    const transformedHistoryItem = {
      ...validHistoryItem,
      details: { line1: [{ fragments: [{ text: 'Transformed detail', bold: false, hyphen: false }] }], line2: null },
    };
    const filteredTabData: IOpalFinesAccountMinorCreditorDetailsHistoryAndNotesTabRefData = {
      version: 'filtered-version',
      history_items: 'not an array',
      historyItems: [validHistoryItem],
    };

    mockOpalFinesService.getMinorCreditorAccountHistoryAndNotesTabData.mockReturnValue(of(filteredTabData));

    component.handleFilterApplied(FINES_ACC_MINOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      [validHistoryItem],
      FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
    expect(emitted).toEqual([
      {
        version: 'filtered-version',
        history_items: 'not an array',
        historyItems: [transformedHistoryItem],
      },
    ]);
  });

  it('should store filter open state from the filter component', () => {
    component.handleFilterOpenChange(true);

    expect(component.filterOpen).toBe(true);
  });
});
