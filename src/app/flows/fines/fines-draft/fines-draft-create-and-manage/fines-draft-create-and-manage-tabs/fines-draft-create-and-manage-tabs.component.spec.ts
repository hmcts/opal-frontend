import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinesDraftCreateAndManageTabsComponent } from './fines-draft-create-and-manage-tabs.component';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_DRAFT_ACCOUNTS_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-draft-accounts.mock';
import { of, firstValueFrom, Subject } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FINES_MAC_PAYLOAD_ADD_ACCOUNT } from '../../../fines-mac/services/fines-mac-payload/mocks/fines-mac-payload-add-account.mock';
import { FinesMacPayloadService } from '../../../fines-mac/services/fines-mac-payload/fines-mac-payload.service';
import { FINES_DRAFT_STATE } from '../../constants/fines-draft-state.constant';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesDraftStoreType } from '../../stores/types/fines-draft.type';
import { FinesDraftStore } from '../../stores/fines-draft.store';
import { FinesDraftService } from '../../services/fines-draft.service';
import { FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK } from '../../fines-draft-table-wrapper/mocks/fines-draft-table-wrapper-table-data.mock';
import { FINES_ACC_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import {
  FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT,
  FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED,
} from '../../fines-draft-table-wrapper/constants/fines-draft-table-wrapper-table-sort.constants';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from '../../../fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_MAC_ROUTING_PATHS } from '@app/flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { type IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_DRAFT_TAB_FRAGMENT } from '../../constants/fines-draft-tab-fragments.constant';
import { FINES_DRAFT_ROUTE_DATA_KEYS } from '../../constants/fines-draft-route-data-keys.constant';
import { OPAL_FINES_DRAFT_ACCOUNT_STATUSES } from '@services/fines/opal-fines-service/constants/opal-fines-draft-account-statues.constant';
import { FINES_DRAFT_RESOLVER_EMPTY_RESPONSE } from '../../routing/resolvers/constants/fines-draft-resolver-empty-response.constant';

const createUserStateWithPermissions = (permissionIds: readonly number[]): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);

  userState.business_unit_users = userState.business_unit_users.map((businessUnitUser) => ({
    ...businessUnitUser,
    permissions: permissionIds.map((permissionId) => ({
      permission_id: permissionId,
      permission_name: `Permission ${permissionId}`,
    })),
  }));

  return userState;
};

describe('FinesDraftCreateAndManageTabsComponent', () => {
  let component: FinesDraftCreateAndManageTabsComponent;
  let fixture: ComponentFixture<FinesDraftCreateAndManageTabsComponent>;
  let globalStore: GlobalStoreType;
  let finesDraftStore: FinesDraftStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let routerEventSubject: Subject<NavigationEnd>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let activatedRoute: ActivatedRoute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let finesDraftService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockDateService: any;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockFinesMacPayloadService: any = {
      mapAccountPayload: vi.fn().mockName('FinesMacPayloadService.mapAccountPayload'),
    };

    mockOpalFinesService = {
      getDraftAccounts: vi.fn().mockName('OpalFines.getDraftAccounts'),
      getDraftAccountById: vi.fn().mockName('OpalFines.getDraftAccountById'),
      clearCache: vi.fn().mockName('OpalFines.clearCache'),
    };
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccountById.mockReturnValue(of(FINES_MAC_PAYLOAD_ADD_ACCOUNT));

    finesDraftService = {
      onDefendantClick: vi.fn().mockName('FinesDraftService.onDefendantClick'),
      populateTableData: vi.fn().mockName('FinesDraftService.populateTableData'),
    };

    mockDateService = {
      getDaysAgo: vi.fn().mockName('DateService.getDaysAgo'),
      getFromFormatToFormat: vi.fn().mockName('DateService.getFromFormatToFormat'),
      getDateRange: vi.fn().mockName('DateService.getDateRange'),
    };
    mockDateService.getDateRange.mockReturnValue({
      from: '2023-01-01',
      to: '2023-01-07',
    });

    routerEventSubject = new Subject<NavigationEnd>();
    mockRouter = {
      navigate: vi.fn().mockName('Router.navigate'),
      events: routerEventSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [FinesDraftCreateAndManageTabsComponent],
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: DateService, useValue: mockDateService },
        { provide: FinesMacPayloadService, useValue: mockFinesMacPayloadService },
        { provide: FinesDraftService, useValue: finesDraftService },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(FINES_DRAFT_TAB_FRAGMENT.review),
            snapshot: {
              fragment: FINES_DRAFT_TAB_FRAGMENT.review,
              data: {},
            },
          },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    globalStore.setUserState(
      createUserStateWithPermissions([
        FINES_PERMISSIONS['create-and-manage-draft-accounts'],
        FINES_PERMISSIONS['search-and-view-accounts'],
      ]),
    );
    globalStore.setFeatureFlags({ 'release-1b': true });

    finesDraftStore = TestBed.inject(FinesDraftStore);

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle tab switch', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component as any, 'handleTabSwitch');
    component.handleTabSwitch(FINES_DRAFT_TAB_FRAGMENT.review);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).handleTabSwitch).toHaveBeenCalledWith(FINES_DRAFT_TAB_FRAGMENT.review);
  });

  it('should initialize with default state', () => {
    component.ngOnInit();
    expect(finesDraftStore.getFinesDraftState()).toEqual(FINES_DRAFT_STATE);
  });

  it('should fetch tab data and rejected count using the default fragment when the initial fragment is missing', async () => {
    const draftAccountsResponse = { ...OPAL_FINES_DRAFT_ACCOUNTS_MOCK, count: 4 };
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.snapshot.fragment = null;
    activatedRoute.snapshot.data = {};
    activatedRoute.fragment = of(null);
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(draftAccountsResponse));
    mockOpalFinesService.getDraftAccounts.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    const tabData = await firstValueFrom(component.tabData$);

    expect(rejectedCount).toBe('4');
    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(2);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenNthCalledWith(1, {
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenNthCalledWith(2, {
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(draftAccountsResponse);
  });

  it('should use the active rejected tab response for the initial rejected count without an extra API call', async () => {
    const rejectedTabResponse = { ...OPAL_FINES_DRAFT_ACCOUNTS_MOCK, count: 3 };
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.rejected);
    activatedRoute.snapshot.fragment = FINES_DRAFT_TAB_FRAGMENT.rejected;
    activatedRoute.snapshot.data = {};
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(rejectedTabResponse));
    mockOpalFinesService.getDraftAccounts.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const rejectedCount = await firstValueFrom(component.rejectedCount$);

    expect(rejectedCount).toBe('3');
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
  });

  it('should handle route navigation correctly', () => {
    const route = 'some/route';
    component.activeTab = FINES_DRAFT_TAB_FRAGMENT.review;
    component.handleRoute(route);
    expect(finesDraftStore.fragment()).toEqual(FINES_DRAFT_TAB_FRAGMENT.review);
    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });

  it('should prevent default and navigate when handleRoute is called with an event', () => {
    const route = 'some/route';
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    component.activeTab = FINES_DRAFT_TAB_FRAGMENT.review;

    component.handleRoute(route, event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(finesDraftStore.fragment()).toEqual(FINES_DRAFT_TAB_FRAGMENT.review);
    expect(mockRouter.navigate).toHaveBeenCalledWith([route], { relativeTo: component['activatedRoute'].parent });
  });

  it('should enforce view all rejected accounts link template semantics', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateConsts = ((FinesDraftCreateAndManageTabsComponent as any).ɵcmp?.consts ?? []).filter(
      (entry: unknown) => Array.isArray(entry),
    ) as unknown[][];
    const templateFunction =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((FinesDraftCreateAndManageTabsComponent as any).ɵcmp?.template?.toString() as string | undefined) ?? '';
    const rejectedLinkConst = templateConsts.find(
      (entry) => entry.includes('govuk-link') && entry.includes('href') && entry.includes('click'),
    );

    expect(rejectedLinkConst).toBeTruthy();
    expect(rejectedLinkConst).toContain('govuk-link--no-visited-state');
    expect(rejectedLinkConst).toContain('href');
    expect(rejectedLinkConst).toContain('');
    expect(rejectedLinkConst).not.toContain('tabindex');
    expect(templateFunction).not.toContain('keydown.enter');
    expect(templateFunction).not.toContain('keyup.enter');
  });

  it('should show "0" when getDraftAccounts returns count 0', async () => {
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of({ count: 0, summaries: [] }));
    finesDraftService.populateTableData.mockReturnValue([]);

    component.ngOnInit();

    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    expect(rejectedCount).toBe('0');

    const tabData = await firstValueFrom(component.tabData$);
    expect(tabData).toEqual([]);
  });

  it('should display "99+" when getDraftAccounts returns count >= 100', async () => {
    mockOpalFinesService.getDraftAccounts.mockReturnValue(of({ count: 100, summaries: [] }));

    component.ngOnInit();

    const rejectedCount = await firstValueFrom(component.rejectedCount$);
    expect(rejectedCount).toBe('99+');
  });

  it('should use resolved tab data and rejected count on initial load without extra API calls', async () => {
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.review);
    activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 100,
    };

    mockOpalFinesService.getDraftAccounts.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    const rejectedCount = await firstValueFrom(component.rejectedCount$);

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    expect(rejectedCount).toBe('99+');
    expect(finesDraftService.populateTableData).toHaveBeenCalledWith(OPAL_FINES_DRAFT_ACCOUNTS_MOCK);
    expect(mockOpalFinesService.getDraftAccounts).not.toHaveBeenCalled();
  });

  it('should fetch the selected tab after consuming resolved data for an invalid initial fragment', () => {
    const fragmentSubject = new Subject<string | null>();
    activatedRoute.fragment = fragmentSubject.asObservable();
    activatedRoute.snapshot.fragment = 'invalid';
    activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: FINES_DRAFT_RESOLVER_EMPTY_RESPONSE,
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 0,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccounts.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const subscription = component.tabData$.subscribe();
    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.review);

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.submitted, OPAL_FINES_DRAFT_ACCOUNT_STATUSES.resubmitted],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });

    subscription.unsubscribe();
  });

  it('should fetch only the selected tab data on tab change', () => {
    const fragmentSubject = new Subject<string | null>();
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.fragment = fragmentSubject.asObservable();
    activatedRoute.snapshot.fragment = FINES_DRAFT_TAB_FRAGMENT.review;
    activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 2,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));
    mockOpalFinesService.getDraftAccounts.mockClear();
    mockOpalFinesService.clearCache.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const subscription = component.tabData$.subscribe();
    const countSubscription = component.rejectedCount$.subscribe();
    mockOpalFinesService.getDraftAccounts.mockClear();

    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.approved);

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.approved],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      accountStatusDateFrom: ['2023-01-01'],
      accountStatusDateTo: ['2023-01-07'],
    });
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('draftAccountsCache$');

    subscription.unsubscribe();
    countSubscription.unsubscribe();
  });

  it('should refresh rejected count from the selected tab data without an extra request', () => {
    const fragmentSubject = new Subject<string | null>();
    const rejectedTabResponse = { ...OPAL_FINES_DRAFT_ACCOUNTS_MOCK, count: 3 };
    const rejectedCounts: string[] = [];
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.fragment = fragmentSubject.asObservable();
    activatedRoute.snapshot.fragment = FINES_DRAFT_TAB_FRAGMENT.review;
    activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
      [FINES_DRAFT_ROUTE_DATA_KEYS.rejectedCount]: 2,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(rejectedTabResponse));
    mockOpalFinesService.getDraftAccounts.mockClear();
    mockOpalFinesService.clearCache.mockClear();

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();

    const subscription = component.tabData$.subscribe();
    const countSubscription = component.rejectedCount$.subscribe((count) => rejectedCounts.push(count));
    mockOpalFinesService.getDraftAccounts.mockClear();

    fragmentSubject.next(FINES_DRAFT_TAB_FRAGMENT.rejected);

    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.rejected],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
    });
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledTimes(1);
    expect(mockOpalFinesService.clearCache).toHaveBeenCalledWith('draftAccountsCache$');
    expect(rejectedCounts).toEqual(['2', '3']);

    subscription.unsubscribe();
    countSubscription.unsubscribe();
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_REVIEW_ACCOUNT when activeTab is not "rejected"', () => {
    component.activeTab = FINES_DRAFT_TAB_FRAGMENT.review;
    component.onDefendantClick(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);
    expect(finesDraftStore.fragment()).toEqual(FINES_DRAFT_TAB_FRAGMENT.review);
    expect(finesDraftStore.amend()).toBeFalsy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(
      FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id'],
      finesDraftService.PATH_REVIEW_ACCOUNT,
    );
  });

  it('should call setFragmentAndAmend and onDefendantClick with PATH_AMEND_ACCOUNT when activeTab is "rejected"', () => {
    component.activeTab = FINES_DRAFT_TAB_FRAGMENT.rejected;
    component.onDefendantClick(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]);
    expect(finesDraftStore.fragment()).toEqual(FINES_DRAFT_TAB_FRAGMENT.rejected);
    expect(finesDraftStore.amend()).toBeTruthy();
    expect(finesDraftService.onDefendantClick).toHaveBeenCalledWith(
      FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK[0]['Defendant id'],
      finesDraftService.PATH_AMEND_ACCOUNT,
    );
  });

  it('should pass additional params for historicWindowInDays if set on this tab', async () => {
    finesDraftService.populateTableData.mockReturnValue(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.deleted);
    activatedRoute.snapshot.data = {
      [FINES_DRAFT_ROUTE_DATA_KEYS.draftAccounts]: OPAL_FINES_DRAFT_ACCOUNTS_MOCK,
    };

    mockOpalFinesService.getDraftAccounts.mockReturnValue(of(OPAL_FINES_DRAFT_ACCOUNTS_MOCK));

    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();

    const tabData = await firstValueFrom(component.tabData$);
    expect(mockOpalFinesService.getDraftAccounts).toHaveBeenCalledWith({
      businessUnitIds: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_id),
      statuses: [OPAL_FINES_DRAFT_ACCOUNT_STATUSES.deleted],
      submittedBy: OPAL_USER_STATE_MOCK.business_unit_users.map((u) => u.business_unit_user_id),
      accountStatusDateFrom: ['2023-01-01'],
      accountStatusDateTo: ['2023-01-07'],
    });

    expect(tabData).toEqual(FINES_DRAFT_TABLE_WRAPPER_TABLE_DATA_MOCK);
  });

  it('should route to account details page onAccountClick', () => {
    const accountId = 77;
    component.onAccountClick(accountId);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      FINES_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.root,
      FINES_ACC_ROUTING_PATHS.children.defendant,
      accountId,
      FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
    ]);
  });

  it('should not route to account details page onAccountClick when release-1b is disabled', () => {
    globalStore.setFeatureFlags({ 'release-1b': false });
    mockRouter.navigate.mockClear();

    component.onAccountClick(77);

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should route to originator type selection page on navigateToCreateAccount', () => {
    component.navigateToCreateAccount();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      FINES_ROUTING_PATHS.root,
      FINES_MAC_ROUTING_PATHS.root,
      FINES_MAC_ROUTING_PATHS.children.originatorType,
    ]);
  });

  it('should use the relevant table sorting based when the active tab is APPROVED', () => {
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.approved);
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_APPROVED);
  });

  it('should use the relevant table sorting based when the active tab is DELETED', () => {
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.deleted);
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_DELETED);
  });

  it('should use the relevant table sorting based when the active tab is IN REVIEW', () => {
    activatedRoute.fragment = of(FINES_DRAFT_TAB_FRAGMENT.review);
    fixture = TestBed.createComponent(FinesDraftCreateAndManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.tableSort).toEqual(FINES_DRAFT_TABLE_WRAPPER_SORT_DEFAULT);
  });
});
