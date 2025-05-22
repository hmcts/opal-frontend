import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCreateAndManageTabsComponent } from './fines-draft-create-and-manage-tabs.component';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of, Subject } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SESSION_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';

describe('FinesDraftCreateAndManageTabsComponent', () => {
  let component: FinesDraftCreateAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  let routerEventSubject: Subject<NavigationEnd>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let finesDraftService: jasmine.SpyObj<FinesDraftService>;

  beforeEach(async () => {
    const mockFinesMacPayloadService: jasmine.SpyObj<FinesMacPayloadService> =
      jasmine.createSpyObj<FinesMacPayloadService>('FinesMacPayloadService', ['mapAccountPayload']);

    finesDraftService = jasmine.createSpyObj<FinesDraftService>('FinesDraftService', [
      'onDefendantClick',
      'createTabDataStream',
      'createRejectedCountStream',
      'handleTabSwitch',
      'populateTableData',
    ]);

    const mockDateService: jasmine.SpyObj<DateService> = jasmine.createSpyObj<DateService>('DateService', [
      'getDaysAgo',
      'getFromFormatToFormat',
    ]);

    routerEventSubject = new Subject<NavigationEnd>();
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], { events: routerEventSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [FinesDraftCreateAndManageTabsComponent],
      providers: [
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: FinesDraftService, useValue: finesDraftService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of('review'),
            snapshot: {
              data: {
                draftAccounts: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
                rejectedCount: 2,
              },
              fragment: 'review',
            },
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(SESSION_USER_STATE_MOCK);

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should initialize with default state when fragment is null', () => {
    activatedRoute.snapshot.fragment = null;
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupTabDataStream').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'setupRejectedCountStream').and.callThrough();

    fixture.detectChanges();
    component.ngOnInit();

    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
    expect(component['setupTabDataStream']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'review');
    expect(component['setupRejectedCountStream']).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK.count, 'review');
  });

  it('should handle route navigation correctly', () => {
    const route = 'some/route';
    finesDraftService.activeTab = 'review';

    component.handleRoute(route);

    expect(finesDraftStore.fragment()).toEqual('review');
    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_REVIEW_ACCOUNT when activeTab is not "rejected"', () => {
    component.finesDraftService.activeTab = 'review';

    component.onDefendantClick(123);

    expect(finesDraftStore.fragment()).toEqual('review');
    expect(finesDraftStore.amend()).toBeFalsy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(123, component.PATH_REVIEW_ACCOUNT);
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_AMEND_ACCOUNT when activeTab is "rejected"', () => {
    component.finesDraftService.activeTab = 'rejected';

    component.onDefendantClick(456);

    expect(finesDraftStore.fragment()).toEqual('rejected');
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(456, component.PATH_AMEND_ACCOUNT);
  });

  it('should call setupTabDataStream with correct arguments on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = spyOn<any>(component, 'setupTabDataStream').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'review');
  });

  it('should call setupRejectedCountStream with correct arguments on ngOnInit', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = spyOn<any>(component, 'setupRejectedCountStream').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledWith(2, 'review');
  });

  it('should assign tabData$ observable from finesDraftService.createTabDataStream', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    finesDraftService.createTabDataStream.and.returnValue(mockTabData$);

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, 'review');

    expect(component.tabData$).toBe(mockTabData$);
    expect(finesDraftService.createTabDataStream).toHaveBeenCalled();
  });

  it('should call createTabDataStream with correct parameters and assign tabData$', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    const initialTab = 'review';
    finesDraftService.createTabDataStream.and.returnValue(mockTabData$);

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, initialTab);

    expect(component.tabData$).toBe(mockTabData$);
    expect(finesDraftService.createTabDataStream).toHaveBeenCalledWith(
      OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      initialTab,
      jasmine.any(Object),
      jasmine.any(Function),
    );

    const paramsFn = finesDraftService.createTabDataStream.calls.mostRecent().args[3];
    const result = paramsFn(initialTab);
    expect(result).toEqual({
      businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
      statuses: jasmine.any(Array),
      submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
    });
  });

  it('should process fragment$ correctly and update activeTab via tap', () => {
    const mockTabData$ = of(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    const initialTab = 'review';

    finesDraftService.createTabDataStream.and.callFake((_initialData, _initialTab, fragment$, getParams) => {
      fragment$.subscribe();

      const result = getParams('review');
      expect(result).toEqual({
        businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
        statuses: jasmine.any(Array),
        submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
      });

      return mockTabData$;
    });

    component['setupTabDataStream'](OPAL_FINES_DRAFT_ACCOUNTS_MOCK, initialTab);

    expect(finesDraftService.createTabDataStream).toHaveBeenCalled();
  });

  it('should assign rejectedCount$ observable from finesDraftService.createRejectedCountStream', () => {
    const mockRejectedCount$ = of('2');
    finesDraftService.createRejectedCountStream.and.returnValue(mockRejectedCount$);

    component['setupRejectedCountStream'](2, 'review');

    expect(component.rejectedCount$).toBe(mockRejectedCount$);
    expect(finesDraftService.createRejectedCountStream).toHaveBeenCalled();
  });

  it('should process fragment$ correctly and trigger createRejectedCountStream logic', () => {
    const mockRejectedCount$ = of('2');
    const initialTab = 'review';

    finesDraftService.createRejectedCountStream.and.callFake(
      (_initialTab, _resolverRejectedCount, fragment$, getParams) => {
        fragment$.subscribe();

        const result = getParams();
        expect(result).toEqual({
          businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
          submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
          statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        });

        return mockRejectedCount$;
      },
    );

    component['setupRejectedCountStream'](2, initialTab);

    expect(finesDraftService.createRejectedCountStream).toHaveBeenCalled();
  });

  it('should trigger rejected count logic on NavigationEnd event', () => {
    const mockRejectedCount$ = of('3');
    const initialTab = 'review';

    finesDraftService.createRejectedCountStream.and.callFake(
      (_initialTab, _resolverRejectedCount, fragment$, getParams) => {
        fragment$.subscribe();

        const result = getParams();
        expect(result).toEqual({
          businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
          submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
          statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        });

        return mockRejectedCount$;
      },
    );

    component['setupRejectedCountStream'](2, initialTab);

    routerEventSubject.next(new NavigationEnd(1, '/some-url', '/some-url#to-review'));

    expect(finesDraftService.createRejectedCountStream).toHaveBeenCalled();
  });

  it('should call createRejectedCountStream with correct parameters and map fragment correctly', () => {
    const mockRejectedCount$ = of('2');
    const initialTab = 'review';

    finesDraftService.createRejectedCountStream.and.callFake((tabArg, rejectedCountArg, fragment$, getParamsFn) => {
      fragment$.subscribe((frag) => {
        expect(frag).toBe(initialTab);
      });

      const result = getParamsFn();
      expect(result).toEqual({
        businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
        submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
        statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      });

      return mockRejectedCount$;
    });

    component['setupRejectedCountStream'](2, initialTab);

    expect(finesDraftService.createRejectedCountStream).toHaveBeenCalled();
  });

  it('should fallback to "review" when fragment is null during navigation', () => {
    const mockRejectedCount$ = of('1');
    const initialTab = 'review';

    const originalFragment = activatedRoute.snapshot.fragment;
    activatedRoute.snapshot.fragment = null;

    finesDraftService.createRejectedCountStream.and.callFake(
      (_initialTab, _resolverRejectedCount, fragment$, getParams) => {
        fragment$.subscribe((frag) => {
          expect(frag).toBe('review');
        });

        const result = getParams();
        expect(result).toEqual({
          businessUnitIds: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_id),
          submittedBy: SESSION_USER_STATE_MOCK.business_unit_user.map((u) => u.business_unit_user_id),
          statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
        });

        return mockRejectedCount$;
      },
    );

    component['setupRejectedCountStream'](1, initialTab);

    routerEventSubject.next(new NavigationEnd(1, '/url', '/url'));

    activatedRoute.snapshot.fragment = originalFragment;
  });

  it('should clean up destroy$ on ngOnDestroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const destroySpy = spyOn<any>(component['destroy$'], 'next').and.callThrough();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const completeSpy = spyOn<any>(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
