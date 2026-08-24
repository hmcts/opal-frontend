import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { FinesAccountStore } from '../../stores/fines-acc.store';
import { FinesAccPayloadService } from '../../services/fines-acc-payload.service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_MOCK } from './mocks/fines-acc-major-creditor-details-history-and-notes-filter-form.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_FILTER_PAYLOAD_MOCK } from './mocks/fines-acc-major-creditor-details-history-and-notes-filter-payload.mock';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FinesAccMajorCreditorDetailsHistoryAndNotesTabComponent } from './fines-acc-major-creditor-details-history-and-notes-tab.component';
import { vi } from 'vitest';
import { FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG } from '../../services/constants/fines-acc-major-creditor-history-and-notes-details-transformation-config.constant';

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
    mockPayloadService.transformHistoryAndNotesItems.mockReturnValue([]);

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

    component.historyAndNotesTabData$.subscribe((data) => emitted.push(data));

    expect(emitted).toEqual([OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK]);
  });

  it('should temporarily transform history items for the PO-2657 browser preview', () => {
    component.historyAndNotesTabData$.subscribe();

    expect(mockPayloadService.transformHistoryAndNotesItems).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK['historyItems'],
      FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMATION_CONFIG,
    );
  });

  it('should fetch filtered tab data when filter values are applied', () => {
    const emitted: unknown[] = [];

    component.historyAndNotesTabData$.subscribe();
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
    expect(emitted).toEqual([
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
    ]);
  });
});
