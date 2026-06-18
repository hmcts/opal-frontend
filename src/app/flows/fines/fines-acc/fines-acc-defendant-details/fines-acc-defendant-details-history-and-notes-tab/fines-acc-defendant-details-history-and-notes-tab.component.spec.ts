import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('FinesAccDefendantDetailsHistoryAndNotesTabComponent', () => {
  let component: FinesAccDefendantDetailsHistoryAndNotesTabComponent;
  let fixture: ComponentFixture<FinesAccDefendantDetailsHistoryAndNotesTabComponent>;
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
    };
    mockAccountStore = {
      compareVersion: vi.fn().mockName('FinesAccountStore.compareVersion'),
    };

    mockPayloadService.buildHistoryFilterPayload.mockReturnValue(
      FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_FILTER_FORM_PAYLOAD_MOCK,
    );
    mockPayloadService.transformPayload.mockImplementation((data: unknown) => data);
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
    component.accountId = FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_ACCOUNT_ID_MOCK;
    component.tabData$ = of(OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK);
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

  it('should store filter open state from the filter component', () => {
    component.handleFilterOpenChange(true);

    expect(component.filterOpen).toBe(true);
  });
});
