import { TestBed } from '@angular/core/testing';
import { FinesMacReviewAccountComponent } from './fines-mac-review-account.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FINES_MAC_STATE_MOCK } from '../mocks/fines-mac-state.mock';
import { OPAL_FINES_COURT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-ref-data.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OPAL_FINES_COURT_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-court-pretty-name.mock';
import { OPAL_FINES_OFFENCES_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-offences-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-ref-data.mock';
import { OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-local-justice-area-pretty-name.mock';
import { OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-add-account-payload.mock';
import { FinesMacPayloadService } from '../services/fines-mac-payload/fines-mac-payload.service';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesMacStoreType } from '../stores/types/fines-mac-store.type';
import { FinesMacStore } from '../stores/fines-mac.store';
import { IFetchMapFinesMacPayload } from '../routing/resolvers/fetch-map-fines-mac-payload-resolver/interfaces/fetch-map-fines-mac-payload.interface';
import { FinesDraftStoreType } from '../../fines-draft/stores/types/fines-draft.type';
import { FinesDraftStore } from '../../fines-draft/stores/fines-draft.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FINES_DRAFT_STATE } from '../../fines-draft/constants/fines-draft-state.constant';
import { OPAL_FINES_RESULTS_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-results-ref-data.mock';
import { OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-major-creditor-ref-data.mock';
import { FINES_MAC_ACCOUNT_TYPES } from '../constants/fines-mac-account-types';
import { OPAL_FINES_PROSECUTOR_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-prosecutor-ref-data.mock';

// Shared factory for setting up the test module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTestModule(snapshotData?: any) {
  const mockOpalFinesService = {
    getCourtPrettyName: jasmine.createSpy('getCourtPrettyName').and.returnValue(OPAL_FINES_COURT_PRETTY_NAME_MOCK),
    getLocalJusticeAreaPrettyName: jasmine
      .createSpy('getLocalJusticeAreaPrettyName')
      .and.returnValue(OPAL_FINES_LOCAL_JUSTICE_AREA_PRETTY_NAME_MOCK),
    getOffenceByCjsCode: jasmine
      .createSpy('getOffenceByCjsCode')
      .and.returnValue(of(OPAL_FINES_OFFENCES_REF_DATA_MOCK)),
    postDraftAddAccountPayload: jasmine
      .createSpy('postDraftAddAccountPayload')
      .and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK))),
    putDraftAddAccountPayload: jasmine
      .createSpy('postDraftAddAccountPayload')
      .and.returnValue(of(structuredClone(OPAL_FINES_DRAFT_ADD_ACCOUNT_PAYLOAD_MOCK))),
  };

  const mockDateService = jasmine.createSpyObj(DateService, ['getFromFormatToFormat', 'calculateAge']);
  const mockUtilsService = jasmine.createSpyObj(UtilsService, [
    'scrollToTop',
    'upperCaseFirstLetter',
    'formatSortCode',
    'formatAddress',
    'convertToMonetaryString',
    'upperCaseAllLetters',
  ]);

  const mockFinesMacPayloadService = jasmine.createSpyObj(FinesMacPayloadService, [
    'buildAddAccountPayload',
    'buildReplaceAccountPayload',
    'mapAccountPayload',
    'getDefendantName',
  ]);
  mockFinesMacPayloadService.buildReplaceAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT));
  mockFinesMacPayloadService.buildAddAccountPayload.and.returnValue(structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT));
  mockFinesMacPayloadService.getDefendantName.and.returnValue('Test Defendant Name');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultData: any = {
    localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
    courts: OPAL_FINES_COURT_REF_DATA_MOCK,
    results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
    majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
  };
  if (snapshotData) {
    Object.assign(defaultData, snapshotData);
  }

  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [FinesMacReviewAccountComponent],
    providers: [
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
          snapshot: {
            paramMap: {
              get: (key: string) => {
                if (key === 'draftAccountId') return '1';
                return null;
              },
            },
            data: defaultData,
          },
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(FinesMacReviewAccountComponent);
  const component = fixture.componentInstance;
  const globalStore = TestBed.inject(GlobalStore);
  globalStore.setUserState(OPAL_USER_STATE_MOCK);
  globalStore.setError({
    error: false,
    message: '',
  });
  const finesMacStore = TestBed.inject(FinesMacStore);
  finesMacStore.setFinesMacStore(FINES_MAC_STATE_MOCK);
  const finesDraftStore = TestBed.inject(FinesDraftStore);
  finesDraftStore.setFinesDraftState(FINES_DRAFT_STATE);
  fixture.detectChanges();
  return {
    fixture,
    component,
    mockOpalFinesService,
    mockFinesMacPayloadService,
    globalStore,
    mockUtilsService,
    finesMacStore,
    finesDraftStore,
    mockDateService,
  };
}

describe('FinesMacReviewAccountComponent', () => {
  describe('when snapshot has localJusticeAreas, courts, results, and major creditors only', () => {
    let component: FinesMacReviewAccountComponent;
    let mockOpalFinesService: Partial<OpalFines>;
    let mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService>;
    let mockUtilsService: jasmine.SpyObj<UtilsService>;
    let finesMacStore: FinesMacStoreType;
    let finesDraftStore: FinesDraftStoreType;

    beforeEach(async () => {
      const setup = createTestModule();
      component = setup.component;
      mockOpalFinesService = setup.mockOpalFinesService;
      mockFinesMacPayloadService = setup.mockFinesMacPayloadService;
      mockUtilsService = setup.mockUtilsService;
      finesMacStore = setup.finesMacStore;
      finesDraftStore = setup.finesDraftStore;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should test setReviewAccountStatus when draft state is null', () => {
      finesDraftStore.setFinesDraftState(FINES_DRAFT_STATE);
      component['setReviewAccountStatus']();
      expect(component.reviewAccountStatus).toEqual('');
    });

    it('should test setAccountDetailsStatus when draft state is unknown', () => {
      finesDraftStore.setFinesDraftState({ ...structuredClone(FINES_DRAFT_STATE), account_status: 'Test' });
      component['setReviewAccountStatus']();
      expect(component.reviewAccountStatus).toEqual('');
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

    it('should handle submitPayload failure', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleRequestErrorSpy = spyOn<any>(component, 'handleRequestError');
      mockOpalFinesService.putDraftAddAccountPayload = jasmine
        .createSpy('putDraftAddAccountPayload')
        .and.returnValue(throwError(() => new Error('Something went wrong')));
      component['handlePutRequest'](FINES_MAC_PAYLOAD_ADD_ACCOUNT);
      expect(handleRequestErrorSpy).toHaveBeenCalled();
    });

    it('should call handleRoute with submitConfirmation on submitPayload success', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      component['submitPayload']();
      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.submitConfirmation);
    });

    it('should handle submitPayload failure', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleRequestErrorSpy = spyOn<any>(component, 'handleRequestError');
      mockOpalFinesService.postDraftAddAccountPayload = jasmine
        .createSpy('postDraftAddAccountPayload')
        .and.returnValue(throwError(() => new Error('Something went wrong')));
      component['handlePostRequest'](FINES_MAC_PAYLOAD_ADD_ACCOUNT);
      expect(handleRequestErrorSpy).toHaveBeenCalled();
    });

    it('should test processPutResponse', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      const expectedResult = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
      finesDraftStore.setFragment('review');

      component['processPutResponse'](expectedResult);

      expect(finesDraftStore.bannerMessage()).toEqual(`You have submitted Test Defendant Name's account for review.`);
      expect(finesMacStore.stateChanges()).toBeFalse();
      expect(finesMacStore.unsavedChanges()).toBeFalse();
      expect(mockFinesMacPayloadService.getDefendantName).toHaveBeenCalledWith(expectedResult);
      expect(handleRouteSpy).toHaveBeenCalledWith(
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.tabs}`,
        false,
        undefined,
        finesDraftStore.fragment(),
      );
    });

    it('should test processPostResponse', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');

      component['processPostResponse']();

      expect(handleRouteSpy).toHaveBeenCalledWith(`${component['finesMacRoutes'].children.submitConfirmation}`);
    });

    it('should test preparePutPayload', () => {
      component['preparePutPayload']();
      expect(mockFinesMacPayloadService.buildReplaceAccountPayload).toHaveBeenCalledWith(
        finesMacStore.getFinesMacStore(),
        finesDraftStore.getFinesDraftState(),
        component['userState'],
      );
    });

    it('should test preparePostPayload', () => {
      component['preparePostPayload']();
      expect(mockFinesMacPayloadService.buildAddAccountPayload).toHaveBeenCalledWith(
        finesMacStore.getFinesMacStore(),
        component['userState'],
      );
    });

    it('should test submitPutPayload', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preparePutPayloadSpy = spyOn<any>(component, 'preparePutPayload');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handlePutRequestSpy = spyOn<any>(component, 'handlePutRequest');

      component['submitPutPayload']();

      expect(preparePutPayloadSpy).toHaveBeenCalled();
      expect(handlePutRequestSpy).toHaveBeenCalled();
    });

    it('should test submitPostPayload', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const preparePostPayloadSpy = spyOn<any>(component, 'preparePostPayload');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handlePostRequestSpy = spyOn<any>(component, 'handlePostRequest');

      component['submitPostPayload']();

      expect(preparePostPayloadSpy).toHaveBeenCalled();
      expect(handlePostRequestSpy).toHaveBeenCalled();
    });

    it('should handle submitPayload success', () => {
      finesDraftStore.setAmend(false);
      const handleRouteSpy = spyOn(component, 'handleRoute');

      component['submitPayload']();

      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.submitConfirmation);
    });

    it('should call handleRoute with POST', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      finesDraftStore.setAmend(false);

      component['submitPayload']();

      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.submitConfirmation);
    });

    it('should call handleRoute with PUT', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      finesDraftStore.setFragmentAndAmend('review', true);

      component['submitPayload']();

      expect(handleRouteSpy).toHaveBeenCalledWith(
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.tabs}`,
        false,
        undefined,
        finesDraftStore.fragment(),
      );
    });

    it('should navigate back on navigateBack when isReadOnly is false', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      component.isReadOnly = false;

      component.navigateBack();

      expect(routerSpy).toHaveBeenCalledWith([component['finesMacRoutes'].children.accountDetails], {
        relativeTo: component['activatedRoute'].parent,
      });
    });

    it('should navigate back to inputter on navigateBack when isReadOnly is true', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      finesDraftStore.setFragment('review');
      finesDraftStore.setViewAllAccounts(false);
      finesDraftStore.setChecker(false);
      component.isReadOnly = true;
      component.navigateBack();
      expect(routerSpy).toHaveBeenCalledWith(
        [
          `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.tabs}`,
        ],
        {
          fragment: finesDraftStore.fragment(),
        },
      );
    });

    it('should navigate back to view-all-rejected on navigateBack when isReadOnly is true and viewAllAccounts is true', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      finesDraftStore.setFragment('review');
      finesDraftStore.setViewAllAccounts(true);
      finesDraftStore.setChecker(false);
      component.isReadOnly = true;
      component.navigateBack();
      expect(routerSpy).toHaveBeenCalledWith([
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.viewAllRejected}`,
      ]);
    });

    it('should navigate back to in-review on navigateBack when checker is true', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      finesDraftStore.setFragment('in-review');
      finesDraftStore.setViewAllAccounts(false);
      finesDraftStore.setChecker(true);
      component.isReadOnly = true;
      component.navigateBack();
      expect(routerSpy).toHaveBeenCalledWith(
        [
          `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.checkAndValidate}/${component['finesDraftCheckAndValidateRoutes'].children.tabs}`,
        ],
        {
          fragment: finesDraftStore.fragment(),
        },
      );
    });

    it('should navigate back to view-all-rejected on navigateBack when isReadOnly is true and viewAllAccounts is true', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      finesDraftStore.setViewAllAccounts(true);
      component.isReadOnly = true;
      component.navigateBack();
      expect(routerSpy).toHaveBeenCalledWith([
        `${component['finesRoutes'].root}/${component['finesDraftRoutes'].root}/${component['finesDraftRoutes'].children.createAndManage}/${component['finesDraftCreateAndManageRoutes'].children.viewAllRejected}`,
      ]);
    });

    it('should navigate back to fixed penalty form when account type is fixed penalty', () => {
      spyOn(component['finesMacStore'], 'getAccountType').and.returnValue(FINES_MAC_ACCOUNT_TYPES['Fixed Penalty']);
      const handleRouteSpy = spyOn(component, 'handleRoute');

      component.navigateBack();

      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.fixedPenaltyDetails);
    });

    it('should navigate back to referrer when account type is fixed penalty and account type is "Rejected"', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute').and.stub();
      component.accountStatus = 'Rejected';
      component.accountType = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];
      component.isReadOnly = false;
      component.navigateBack();

      expect(handleRouteSpy).toHaveBeenCalledWith(
        component['getBackPath'](),
        false,
        undefined,
        component['finesDraftStore'].fragment(),
      );
    });

    it('should submit payload on submitForReview', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submitPayloadSpy = spyOn<any>(component, 'submitPayload').and.callThrough();

      component.submitForReview();

      expect(submitPayloadSpy).toHaveBeenCalled();
    });

    it('should navigate on handleRoute with event', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      const event = jasmine.createSpyObj(Event, ['preventDefault']);

      component.handleRoute('test', true, event);

      expect(routerSpy).toHaveBeenCalledWith(['test']);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate on handleRoute', () => {
      const routerSpy = spyOn(component['router'], 'navigate');

      component.handleRoute('test');

      expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    });

    it('should navigate on handleRoute with event', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      const event = jasmine.createSpyObj(Event, ['preventDefault']);

      component.handleRoute('test', true, event);

      expect(routerSpy).toHaveBeenCalledWith(['test']);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call handleRoute with relative route when handleDeleteAccount is called and account id is 0', () => {
      spyOn(component, 'handleRoute').and.stub();
      spyOn(component['finesMacStore'], 'setDeleteFromCheckAccount').and.stub();
      const route = component['finesMacRoutes'].children.deleteAccountConfirmation;
      const mockEvent: Event = jasmine.createSpyObj('Event', ['preventDefault']);
      component.accountId = 0; // Set accountId to 0 to simulate the condition

      component.handleDeleteAccount(mockEvent);

      expect(component.handleRoute).toHaveBeenCalledWith(route, false, mockEvent);
      expect(component['finesMacStore'].setDeleteFromCheckAccount).toHaveBeenCalledTimes(0);
    });

    it('should call handleRoute with relative route when handleDeleteAccount is called and account id is > 0', () => {
      spyOn(component, 'handleRoute').and.stub();
      spyOn(component['finesMacStore'], 'setDeleteFromCheckAccount').and.stub();
      const route = component['finesMacRoutes'].children.deleteAccountConfirmation + `/${component.accountId}`;
      const mockEvent: Event = jasmine.createSpyObj('Event', ['preventDefault']);
      component.accountId = 1; // Set accountId to 1 to simulate the condition

      component.handleDeleteAccount(mockEvent);

      expect(component.handleRoute).toHaveBeenCalledWith(route, false, mockEvent);
      expect(component['finesMacStore'].setDeleteFromCheckAccount).toHaveBeenCalledTimes(1);
    });

    it('should navigate on handleRoute to delete account', () => {
      const routerSpy = spyOn(component['router'], 'navigate');

      component.handleRoute(component['finesMacRoutes'].children.deleteAccountConfirmation);

      expect(routerSpy).toHaveBeenCalledWith([component['finesMacRoutes'].children.deleteAccountConfirmation], {
        relativeTo: component['activatedRoute'].parent,
      });
    });

    it('should scroll to top and return null on handleRequestError', () => {
      const result = component['handleRequestError']();
      expect(mockUtilsService.scrollToTop).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should route to the account details page when change() is called from a fine account', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      component.accountType = FINES_MAC_ACCOUNT_TYPES['Fine'];

      component.change();

      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.accountDetails);
    });

    it('should route to the fixed penalty details form when change() is called from a fixed penalty account', () => {
      const handleRouteSpy = spyOn(component, 'handleRoute');
      component.accountType = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];

      component.change();

      expect(handleRouteSpy).toHaveBeenCalledWith(component['finesMacRoutes'].children.fixedPenaltyDetails);
    });
  });

  describe('when snapshot has localJusticeAreas, courts, results, major creditors and reviewAccountFetchMap', () => {
    let component: FinesMacReviewAccountComponent;

    it('should test reviewAccountFetchedMappedPayload', () => {
      const snapshotData: IFetchMapFinesMacPayload = {
        finesMacState: structuredClone(FINES_MAC_STATE_MOCK),
        finesMacDraft: structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT),
        courts: OPAL_FINES_COURT_REF_DATA_MOCK,
        localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
        majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
        results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
        prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
      };
      const setup = createTestModule({ reviewAccountFetchMap: snapshotData });
      component = setup.component;
      component['reviewAccountFetchedMappedPayload']();
      expect(component.isReadOnly).toBeTrue();
    });

    it('should set correct flags when  reviewAccountFetchedMappedPayload is called for a fixed penalty account', () => {
      const finesMacState = structuredClone(FINES_MAC_STATE_MOCK);
      const finesMacDraft = structuredClone(FINES_MAC_PAYLOAD_ADD_ACCOUNT);
      finesMacState.accountDetails.formData.fm_create_account_account_type = FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'];
      finesMacDraft.account_status = 'Rejected';
      const snapshotData: IFetchMapFinesMacPayload = {
        finesMacState,
        finesMacDraft,
        courts: OPAL_FINES_COURT_REF_DATA_MOCK,
        localJusticeAreas: OPAL_FINES_LOCAL_JUSTICE_AREA_REF_DATA_MOCK,
        majorCreditors: OPAL_FINES_MAJOR_CREDITOR_REF_DATA_MOCK,
        results: OPAL_FINES_RESULTS_REF_DATA_MOCK,
        prosecutors: OPAL_FINES_PROSECUTOR_REF_DATA_MOCK,
      };
      const setup = createTestModule({ reviewAccountFetchMap: snapshotData });
      component = setup.component;
      component['finesDraftStore'].setChecker(false);

      component['reviewAccountFetchedMappedPayload']();
      expect(component.isReadOnly).toBeFalse();
    });
  });

  describe('when ActivatedRoute.snapshot is nullish', () => {
    let component: FinesMacReviewAccountComponent;

    beforeEach(() => {
      const setup = createTestModule();
      component = setup.component;

      // force snapshot to be undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component['activatedRoute'].snapshot = undefined as any;
    });

    it('should return early if snapshot is falsy', () => {
      const result = component['reviewAccountFetchedMappedPayload']();
      expect(result).toBeUndefined(); // no side effects
    });
  });
});
