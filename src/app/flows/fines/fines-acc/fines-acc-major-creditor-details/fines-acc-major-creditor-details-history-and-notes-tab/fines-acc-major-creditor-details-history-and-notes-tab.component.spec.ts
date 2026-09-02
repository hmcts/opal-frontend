import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from './mocks/fines-acc-major-creditor-details-history-and-notes-filter-form.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_PAYLOAD_MOCK } from './mocks/fines-acc-major-creditor-details-history-and-notes-filter-payload.mock';
import { FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG } from '../../services/constants/fines-acc-major-creditor-history-and-notes-details-transformation-config.constant';
import { IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.interface';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent } from './fines-acc-major-creditor-details-history-and-notes-tab.component';
import { FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent } from './fines-acc-major-creditor-details-history-and-notes-table/fines-acc-major-creditor-details-history-and-notes-table.component';
import { vi } from 'vitest';

describe('FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent', () => {
  let component: FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPayloadService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockAccountStore: any;

  beforeEach(async () => {
    mockOpalFinesService = {
      getMajorCreditorAccountHistoryAndNotesTabData: vi.fn(),
    };
    mockPayloadService = {
      buildMajorCreditorHistoryFilterPayload: vi.fn(),
      transformHistoryAndNotesItems: vi.fn(),
    };
    mockAccountStore = {
      compareVersion: vi.fn(),
    };

    mockOpalFinesService.getMajorCreditorAccountHistoryAndNotesTabData.mockReturnValue(
      of(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK),
    );
    mockPayloadService.buildMajorCreditorHistoryFilterPayload.mockReturnValue(
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_PAYLOAD_MOCK,
    );
    mockPayloadService.transformHistoryAndNotesItems.mockImplementation((historyItems: unknown[]) => historyItems);

    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent],
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

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent);
    component = fixture.componentInstance;
    component.accountId = 123;
    component.tabData$ = of(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the history and notes filter scaffold without categories', () => {
    const textContent = fixture.nativeElement.textContent;

    expect(textContent).toContain('History and notes');
    expect(textContent).toContain('Show filter');
    expect(textContent).toContain('Date from');
    expect(textContent).toContain('Date to');
    expect(textContent).toContain('Filter');
    expect(textContent).not.toContain('Categories');
    expect(fixture.nativeElement.querySelector('hr')).toBeNull();
  });

  it('should render the major creditor history table with the parent tab data', () => {
    const historyTable = fixture.debugElement.query(
      By.directive(FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent),
    ).componentInstance as FinesAccMajorCreditorDetailsHistoryAndNotesTableComponent;

    expect(historyTable.tabData).toEqual(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
  });

  it('should keep the submitted filter form and details state', () => {
    component.handleFilterApplied(FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);

    expect(component.filterForm).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    expect(component.filterOpen).toBe(true);
  });

  it('should store filter details open state changes', () => {
    component.handleFilterOpenChange(true);
    expect(component.filterOpen).toBe(true);

    component.handleFilterOpenChange(false);
    expect(component.filterOpen).toBe(false);
  });

  it('should use the parent-provided tab data stream', () => {
    const emitted: unknown[] = [];

    mockPayloadService.transformHistoryAndNotesItems.mockClear();
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK['historyItems'],
      FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
    expect(emitted).toEqual([OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK]);
  });

  it('should transform history items when the API uses the supported history_items key', () => {
    const rawItems = [{ type: 'Financial', details: { transactionType: { transactionType: 'BACS' } } }];
    const transformedItems = [{ type: 'Financial', details: { line1: [], line2: null } }];
    const tabData = {
      version: null,
      history_items: rawItems,
    } as IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData;
    const emitted: unknown[] = [];

    mockPayloadService.transformHistoryAndNotesItems.mockReset();
    mockPayloadService.transformHistoryAndNotesItems.mockReturnValue(transformedItems);
    component.tabData$ = of(tabData);
    component.ngOnChanges({ tabData$: new SimpleChange(null, component.tabData$, false) });
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      rawItems,
      FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
    expect(emitted.at(-1)).toEqual({ ...tabData, history_items: transformedItems });
  });

  it('should preserve tab data without history items without calling the transformer', () => {
    const tabData = { version: null } as IOpalFinesAccountMajorCreditorDetailsHistoryAndNotesTabRefData;
    const emitted: unknown[] = [];

    mockPayloadService.transformHistoryAndNotesItems.mockClear();
    component.tabData$ = of(tabData);
    component.ngOnChanges({ tabData$: new SimpleChange(null, component.tabData$, false) });
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.transformHistoryAndNotesItems).not.toHaveBeenCalled();
    expect(emitted.at(-1)).toEqual(tabData);
  });

  it('should fetch filtered tab data when filter values are applied', () => {
    const emitted: unknown[] = [];

    component.historyAndNotesTabData$.subscribe();
    mockPayloadService.transformHistoryAndNotesItems.mockClear();
    component.handleFilterApplied(FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK);
    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(mockPayloadService.buildMajorCreditorHistoryFilterPayload).toHaveBeenCalledWith(
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK,
    );
    expect(mockOpalFinesService.getMajorCreditorAccountHistoryAndNotesTabData).toHaveBeenCalledWith(
      123,
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_PAYLOAD_MOCK,
    );
    expect(mockAccountStore.compareVersion).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK.version,
    );
    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK['historyItems'],
      FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
    expect(emitted).toEqual([
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
    ]);
  });
});
