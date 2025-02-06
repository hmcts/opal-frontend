import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountComponent } from './fines-mac-review-account.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-pretty-name.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { UtilsService } from '@services/utils/utils.service';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { GlobalStoreType } from '@stores/global/types/global-store.type';
import { DateService } from '@services/date-service/date.service';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FINES_MAC_STATE } from '../constants/fines-mac-state';

describe('FinesMacReviewAccountComponent', () => {
  let component: FinesMacReviewAccountComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let globalStore: GlobalStoreType;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(FinesService, ['finesMacState', 'finesDraftState', 'finesDraftFragment']);
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    mockFinesService.finesDraftState = { ...structuredClone(FINES_DRAFT_STATE), account_status: 'Submitted' };
    mockFinesService.finesDraftFragment.and.returnValue('review');

    mockOpalFinesService = {
      getCourts: jasmine.createSpy('getCourts').and.returnValue(of(OPAL_FINES_COURT_REF_DATA_MOCK)),
      getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
      getLocalJusticeAreas: jasmine
        .createSpy('getLocalJusticeAreas')
        .and.returnValue(of(OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK)),
      getLocalJusticeAreaPrettyName: jasmine
        .createSpy('getLocalJusticeAreaPrettyName')
        .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
      getResults: jasmine.createSpy('getResults').and.returnValue(of(OPAL_FINES_RESULTS_REF_DATA_MOCK)),
      getMajorCreditors: jasmine
        .createSpy('getMajorCreditors')
        .and.returnValue(of(OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK)),
      getOffenceByCjsCode: jasmine
        .createSpy('getOffenceByCjsCode')
        .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
      postDraftAddAccountPayload: jasmine
        .createSpy('postDraftAddAccountPayload')
        .and.returnValue(of({ ...OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK })),
    };

    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, [
      'buildAddAccountPayload',
      'mapAccountPayload',
    ]);
    mockFinesMacPayloadService.buildAddAccountPayload.and.returnValue({ ...FINES_MAC_PAYLOAD_ADD_ACCOUNT });

    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'scrollToTop',
      'upperCaseFirstLetter',
      'formatSortCode',
      'formatAddress',
      'convertToMonetaryString',
    ]);

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FinesMacReviewAccountComponent);
    component = fixture.componentInstance;

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);
    globalStore.setError({
      error: false,
      message: '',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have state and populate data$', () => {
    expect(component['enforcementCourtsData$']).not.toBeUndefined();
  });

  it('should navigate on handleRoute', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test');

    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should navigate on handleRoute to delete account', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute(component['finesMacRoutes'].children.deleteAccountConfirmation);

    expect(routerSpy).toHaveBeenCalledWith([component['finesMacRoutes'].children.deleteAccountConfirmation], {
      relativeTo: component['activatedRoute'].parent,
    });
    expect(mockFinesService.finesMacState.deleteFromCheckAccount).toBeTrue();
  });

  it('should navigate on handleRoute with relative to', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test', true);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
  });

  it('should navigate on handleRoute with fragment', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.handleRoute('test', false, undefined, 'review');

    expect(routerSpy).toHaveBeenCalledWith(['test'], { fragment: 'review' });
  });

  it('should navigate on handleRoute with event', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj(Event, ['preventDefault']);

    component.handleRoute('test', true, event);

    expect(routerSpy).toHaveBeenCalledWith(['test']);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith([component['finesMacRoutes'].children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should submit payload on submitForReview', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitPayloadSpy = spyOn<any>(component, 'submitPayload').and.callThrough();
    component.submitForReview();
    expect(submitPayloadSpy).toHaveBeenCalled();
  });

  it('should handle submitPayload success', () => {
    const handleRouteSpy = spyOn(component, 'handleRoute');
    component['submitPayload']();
    expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.submitConfirmation);
  });

  it('should handle submitPayload failure', () => {
    globalStore.setError({
      error: true,
      message: 'Something went wrong',
    });
    mockOpalFinesService.postDraftAddAccountPayload = jasmine
      .createSpy('postDraftAddAccountPayload')
      .and.returnValue(throwError(() => new Error('Something went wrong')));
    component['submitPayload']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });

  it('should navigate back on navigateBack', () => {
    const routerSpy = spyOn(component['router'], 'navigate');

    component.isReadOnly = true;
    component.navigateBack();

    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.inputter}`,
      ],
      {
        fragment: 'review',
      },
    );
  });

  it('should call reviewAccountFetchedMappedPayload on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewAccountFetchedMappedPayloadSpy = spyOn<any>(
      component,
      'reviewAccountFetchedMappedPayload',
    ).and.callThrough();

    component.ngOnInit();

    expect(reviewAccountFetchedMappedPayloadSpy).toHaveBeenCalled();
  });

  it('should test reviewAccountFetchedMappedPayload', () => {
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
    };
    component['activatedRoute'].snapshot = {
      data: {
        reviewAccountFetchMap: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['reviewAccountFetchedMappedPayload']();

    expect(component.isReadOnly).toBeTrue();
    expect(component['finesService'].finesDraftState).toEqual(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    expect(component['finesService'].finesMacState).toEqual(FINES_MAC_STATE_MOCK);
    expect(component.reviewAccountStatus).toEqual('In review');
  });

  it('should test reviewAccountFetchedMappedPayload', () => {
    mockFinesService.finesMacState = structuredClone(FINES_MAC_STATE);
    mockFinesService.finesDraftState = structuredClone(FINES_DRAFT_STATE);
    const snapshotData: IFetchMapFinesMacPayload = {
      finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
      finesMacDraft: structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
    };
    component['activatedRoute'].snapshot = {
      data: {
        test: snapshotData,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['reviewAccountFetchedMappedPayload']();

    expect(component['finesService'].finesMacState).toEqual(FINES_MAC_STATE);
    expect(component['finesService'].finesDraftState).toEqual(FINES_DRAFT_STATE);
  });

  it('should call handleRoute with submitConfirmation on submitPayload success', () => {
    const handleRouteSpy = spyOn(component, 'handleRoute');
    component['submitPayload']();
    expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.submitConfirmation);
  });

  it('should call scrollToTop on submitPayload failure', () => {
    mockOpalFinesService.postDraftAddAccountPayload = jasmine
      .createSpy('postDraftAddAccountPayload')
      .and.returnValue(throwError(() => new Error('Something went wrong')));
    component['submitPayload']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });

  it('should navigate back to inputter on navigateBack when isReadOnly is true', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.isReadOnly = true;
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith(
      [
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.inputter}`,
      ],
      {
        fragment: 'review',
      },
    );
  });

  it('should navigate back to accountDetails on navigateBack when isReadOnly is false', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.isReadOnly = false;
    component.navigateBack();
    expect(routerSpy).toHaveBeenCalledWith([component['finesMacRoutes'].children.accountDetails], {
      relativeTo: component['activatedRoute'].parent,
    });
  });

  it('should test setReviewAccountStatus when draft state is null', () => {
    mockFinesService.finesDraftState = FINES_DRAFT_STATE;
    component['setReviewAccountStatus']();
    expect(component.reviewAccountStatus).toBeUndefined();
  });

  it('should test setAccountDetailsStatus when draft state is unknown', () => {
    mockFinesService.finesDraftState = { ...structuredClone(FINES_DRAFT_STATE), account_status: 'Test' };
    component['setReviewAccountStatus']();
    expect(component.reviewAccountStatus).toEqual('');
  });
});
