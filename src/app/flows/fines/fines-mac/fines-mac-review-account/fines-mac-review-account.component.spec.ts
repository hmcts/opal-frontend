import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { UtilsService } from '@services/utils/utils.service';
import { DateService } from '@services/date-service/date.service';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { signal } from '@angular/core';

describe('FinesMacReviewAccountComponent', () => {
  let component: FinesMacReviewAccountComponent;
  let fixture: ComponentFixture<FinesMacReviewAccountComponent>;
  let mockFinesService: jasmine.SpyObj<FinesService>;
  let mockOpalFinesService: Partial<OpalFines>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let mockDateService: jasmine.SpyObj<DateService>;
  let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
  let mockGlobalStateService: jasmine.SpyObj<GlobalStateService>;

  const mockFinesDraftAmend = signal<boolean>(false);
  const mockFinesDraftBannerMessage = signal<string>('');
  const mockFinesDraftFragment = signal<string>('');

  beforeEach(async () => {
    mockFinesService = jasmine.createSpyObj(
      'FinesService',
      ['finesMacState', 'finesDraftState', 'finesDraftFragment', 'finesDraftAmend', 'finesDraftBannerMessage'],
      {
        finesDraftFragment: mockFinesDraftFragment,
        finesDraftAmend: mockFinesDraftAmend,
        finesDraftBannerMessage: mockFinesDraftBannerMessage,
      },
    );
    mockFinesService.finesMacState = { ...FINES_MAC_STATE_MOCK };
    mockFinesService.finesDraftState = { ...structuredClone(FINES_DRAFT_STATE), account_status: 'Submitted' };

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
      putDraftAddAccountPayload: jasmine
        .createSpy('putDraftAddAccountPayload')
        .and.returnValue(of(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK)),
    };

    mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
    mockUtilsService = jasmine.createSpyObj(UtilsService, [
      'scrollToTop',
      'upperCaseFirstLetter',
      'formatSortCode',
      'formatAddress',
      'convertToMonetaryString',
    ]);

    mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, ['buildReplaceAccountPayload']);
    mockFinesMacPayloadService.buildReplaceAccountPayload.and.returnValue(
      structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
    );

    mockGlobalStateService = jasmine.createSpyObj('GlobalStateService', ['error', 'userState'], {
      error: { set: jasmine.createSpy('set') },
      userState: jasmine.createSpy('userState').and.returnValue(SESSION_USER_STATE_MOCK),
    });

    await TestBed.configureTestingModule({
      imports: [FinesMacReviewAccountComponent],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: UtilsService, useValue: mockUtilsService },
        { provide: DateService, useValue: mockDateService },
        { provide: GlobalStateService, useValue: mockGlobalStateService },
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

  it('should navigate back on navigateBack', () => {
    const handleRouteSpy = spyOn(component, 'handleRoute');
    mockFinesService.finesDraftFragment.set('review');

    component.isReadOnly = true;
    component.navigateBack();

    expect(handleRouteSpy).toHaveBeenCalledWith(
      `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.inputter}`,
      false,
      undefined,
      'review',
    );
  });

  it('should set business unit and isReadOnly on getBusinessUnit', () => {
    component['activatedRoute'].snapshot = {
      data: {
        businessUnit: OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component['getBusinessUnit']();

    expect(component['businessUnit']).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]);
    expect(component.isReadOnly).toBeTrue();
  });

  it('should call getBusinessUnit on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getBusinessUnitSpy = spyOn<any>(component, 'getBusinessUnit').and.callThrough();

    component.ngOnInit();

    expect(getBusinessUnitSpy).toHaveBeenCalled();
  });

  it('should submit payload on submitForReview', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitPayloadSpy = spyOn<any>(component, 'submitPayload').and.callThrough();
    component.submitForReview();
    expect(submitPayloadSpy).toHaveBeenCalled();
  });

  it('should handle submitPayload success', () => {
    const handleRouteSpy = spyOn(component, 'handleRoute');
    mockFinesService.finesDraftAmend.set(true);
    mockFinesService.finesDraftState = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    mockFinesService.finesDraftFragment.set('rejected');

    component['submitPayload']();

    expect(handleRouteSpy).toHaveBeenCalledWith(
      `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.inputter}`,
      false,
      undefined,
      'rejected',
    );
  });

  it('should handle submitPayload failure', () => {
    mockGlobalStateService.error.set({
      error: true,
      message: 'Something went wrong',
    });
    mockOpalFinesService.putDraftAddAccountPayload = jasmine
      .createSpy('postDraftAddAccountPayload')
      .and.returnValue(throwError(() => new Error('Something went wrong')));
    mockFinesService.finesDraftAmend.set(true);
    component['submitPayload']();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  });

  it('should set banner message and navigate on successful putPayload', fakeAsync(() => {
    const payload = FINES_MAC_PAYLOAD_ADD_ACCOUNT;
    const handleRouteSpy = spyOn(component, 'handleRoute');
    mockFinesService.finesDraftFragment.set('rejected');

    // Mock the service method
    mockOpalFinesService.putDraftAddAccountPayload = jasmine
      .createSpy('putDraftAddAccountPayload')
      .and.returnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT));

    // Execute the method
    component['putPayload'](payload);

    tick();

    // Assert the signal was updated
    expect(mockFinesService.finesDraftBannerMessage()).toBe(
      `You have submitted ${payload.account_snapshot?.defendant_name}'s account for review`,
    );

    // Assert navigation
    expect(handleRouteSpy).toHaveBeenCalledWith(
      `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.inputter}`,
      false,
      undefined,
      'rejected',
    );
  }));

  it('should scroll to top on putPayload error', fakeAsync(() => {
    mockGlobalStateService.error.set({
      error: true,
      message: 'Something went wrong',
    });
    mockOpalFinesService.putDraftAddAccountPayload = jasmine
      .createSpy('putDraftAddAccountPayload')
      .and.returnValue(throwError(() => new Error('Something went wrong')));
    component['putPayload'](FINES_MAC_PAYLOAD_ADD_ACCOUNT);
    tick();
    expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
  }));

  it('should complete ngUnsubscribe on ngOnDestroy', () => {
    const nextSpy = spyOn(component['ngUnsubscribe'], 'next');
    const completeSpy = spyOn(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
    expect(mockGlobalStateService.error.set).toHaveBeenCalledWith({
      error: false,
      message: '',
    });
  });
});
