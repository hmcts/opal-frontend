import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MojSubNavigationComponent,
  MojSubNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-sub-navigation';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesAccMajorCreditorDetailsComponent } from './fines-acc-major-creditor-details.component';
import { FinesAccPayloadService } from '../services/fines-acc-payload.service';
import { MOCK_FINES_ACCOUNT_STATE } from '../mocks/fines-acc-state.mock';
import { FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK } from './mocks/fines-acc-major-creditor-details-header.mock';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-at-a-glance-with-defendant.mock';
import { OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK } from '../../services/opal-fines-service/mocks/opal-fines-account-major-creditor-details-history-and-notes-tab-ref-data.mock';

describe('FinesAccMajorCreditorDetailsComponent', () => {
  let component: FinesAccMajorCreditorDetailsComponent;
  let fixture: ComponentFixture<FinesAccMajorCreditorDetailsComponent>;
  let activatedRouteStub: Partial<ActivatedRoute>;
  let mockOpalFinesService: Pick<
    OpalFines,
    | 'getMajorCreditorAccountHeadingData'
    | 'getMajorCreditorAccountAtAGlance'
    | 'getMajorCreditorAccountHistoryAndNotesTabData'
    | 'clearCache'
    | 'getResult'
  >;
  let mockPayloadService: Pick<
    FinesAccPayloadService,
    'transformMajorCreditorAccountHeaderForStore' | 'transformPayload'
  >;

  beforeEach(async () => {
    activatedRouteStub = {
      fragment: of('at-a-glance'),
      snapshot: {
        data: {
          majorCreditorAccountHeadingData: structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK),
        },
        fragment: 'at-a-glance',
        paramMap: convertToParamMap({ accountId: '123' }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any as ActivatedRouteSnapshot,
    };

    mockPayloadService = {
      transformMajorCreditorAccountHeaderForStore: vi.fn().mockReturnValue(MOCK_FINES_ACCOUNT_STATE),
      transformPayload: vi.fn().mockImplementation((...args) => args[0]),
    };

    mockOpalFinesService = {
      getMajorCreditorAccountHeadingData: vi
        .fn()
        .mockReturnValue(of(structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK))),
      getMajorCreditorAccountAtAGlance: vi
        .fn()
        .mockReturnValue(of(structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_AT_A_GLANCE_MOCK))),
      getMajorCreditorAccountHistoryAndNotesTabData: vi
        .fn()
        .mockReturnValue(of(structuredClone(OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK))),
      clearCache: vi.fn(),
      getResult: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesAccMajorCreditorDetailsComponent, MojSubNavigationComponent, MojSubNavigationItemComponent],
      providers: [
        { provide: Router, useValue: { navigate: vi.fn(), createUrlTree: vi.fn(), serializeUrl: vi.fn() } },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesAccPayloadService, useValue: mockPayloadService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesAccMajorCreditorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize accountData and activeTab from route data', () => {
    expect(component.accountData).toEqual(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    expect(component.activeTab).toBe('at-a-glance');
    expect(mockPayloadService.transformMajorCreditorAccountHeaderForStore).toHaveBeenCalledWith(
      123,
      FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK,
    );
  });

  it('should fetch major creditor account heading data for the supplied account ID', async () => {
    const headingData = structuredClone(FINES_ACC_MAJOR_CREDITOR_DETAILS_HEADER_MOCK);
    vi.mocked(mockOpalFinesService.getMajorCreditorAccountHeadingData).mockReturnValue(of(headingData));

    const result = await firstValueFrom(
      (
        component as unknown as {
          getHeaderData: (accountId: number) => ReturnType<OpalFines['getMajorCreditorAccountHeadingData']>;
        }
      ).getHeaderData(456),
    );

    expect(mockOpalFinesService.getMajorCreditorAccountHeadingData).toHaveBeenCalledWith(456);
    expect(result).toEqual(headingData);
  });

  it('should render the history and notes tab in the sub-navigation', () => {
    expect(fixture.nativeElement.textContent).toContain('History and notes');
  });

  it('should fetch history and notes tab data when fragment is changed to history and notes', () => {
    vi.mocked(mockPayloadService.transformPayload).mockClear();

    component['refreshFragment$'].next('history-and-notes');
    component.tabHistoryAndNotes$.subscribe();

    expect(mockOpalFinesService.getMajorCreditorAccountHistoryAndNotesTabData).toHaveBeenCalledWith(
      MOCK_FINES_ACCOUNT_STATE.account_id,
    );
    expect(mockPayloadService.transformPayload).toHaveBeenCalledWith(
      OPAL_FINES_ACCOUNT_MAJOR_CREDITOR_DETAILS_HISTORY_AND_NOTES_TAB_REF_DATA_MOCK,
      expect.any(Array),
    );
  });
});
