import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, RouterModule, Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DateTime } from 'luxon';
import { By } from '@angular/platform-browser';
import { GovukFooterComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-footer';
import {
  MojHeaderComponent,
  MojHeaderNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-header';
import { MojPrimaryNavigationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-primary-navigation';
import { Observable, Subject, of } from 'rxjs';
import { Component, PLATFORM_ID } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { ISessionTokenExpiry } from '@hmcts/opal-frontend-common/services/session-service/interfaces';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { SESSION_TOKEN_EXPIRY_MOCK } from '@hmcts/opal-frontend-common/services/session-service/mocks';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { MojAlertComponent } from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSpyObj } from './testing/create-spy-obj.helper';
import { FINES_DASHBOARD_ROUTING_PATHS } from './flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from './flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DRAFT_ROUTING_PATHS } from './flows/fines/fines-draft/routing/constants/fines-draft-routing-paths.constant';
import { ACCOUNTS_PERMISSIONS } from './flows/fines/constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from './flows/fines/constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from './flows/fines/constants/search-permissions.constant';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
} from './flows/fines/constants/release-feature-flags.constant';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from './constants/route-data.constant';
import { FINES_ACC_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_CON_ROUTING_PATHS } from './flows/fines/fines-con/routing/constants/fines-con-routing-paths.constant';
import { FINES_MAC_ROUTING_PATHS } from './flows/fines/fines-mac/routing/constants/fines-mac-routing-paths.constant';
const mockTokenExpiry: ISessionTokenExpiry = SESSION_TOKEN_EXPIRY_MOCK;
const DEFAULT_RELEASE_FEATURE_FLAGS = {
  [RELEASE_1A_FEATURE_FLAG]: true,
  [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
  [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: true,
};

@Component({
  standalone: true,
  template: '',
})
class DummyDashboardRouteComponent {}

const createUserStateWithPermissions = (permissionIds: readonly number[]): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);
  const [firstBusinessUnit, secondBusinessUnit] = userState.business_unit_users;

  userState.business_unit_users = [
    {
      ...firstBusinessUnit,
      permissions: [],
    },
    {
      ...secondBusinessUnit,
      permissions: permissionIds.map((permissionId) => ({
        permission_id: permissionId,
        permission_name: `Permission ${permissionId}`,
      })),
    },
  ];

  return userState;
};

const getPrimaryNavigationTexts = (fixture: ComponentFixture<AppComponent>): string[] =>
  Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.moj-primary-navigation__link')).map(
    (link) => link.textContent?.trim() ?? '',
  );

const hasPrimaryNavigation = (fixture: ComponentFixture<AppComponent>): boolean =>
  fixture.debugElement.query(By.directive(MojPrimaryNavigationComponent)) !== null;

const navigateToUrl = async (fixture: ComponentFixture<AppComponent>, router: Router, url: string): Promise<void> => {
  await fixture.ngZone!.run(async () => {
    await router.navigateByUrl(url);
  });
  fixture.detectChanges();
};

const callAppComponentMethod = <T>(methodName: string, context: object, ...args: unknown[]): T =>
  (AppComponent.prototype as unknown as Record<string, (...methodArgs: unknown[]) => T>)[methodName].call(
    context,
    ...args,
  );

const getDefendantAccountRoutes = (): Routes => [
  {
    path: `${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    children: [
      {
        path: FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,
        component: DummyDashboardRouteComponent,
      },
      {
        path: '',
        data: {
          [HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]: true,
        },
        children: [
          {
            path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`,
            component: DummyDashboardRouteComponent,
          },
        ],
      },
    ],
  },
];
describe('AppComponent - browser', () => {
  const mockDocumentLocation = {
    location: {
      href: '',
    },
  };
  let globalStore: GlobalStoreType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dateService: any;

  beforeEach(() => {
    const dateServiceSpy = createSpyObj(DateService, [
      'convertMillisecondsToMinutes',
      'calculateMinutesDifference',
      'getFromIso',
      'getDateNow',
    ]);

    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        MojAlertComponent,
        MojPrimaryNavigationComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: DateService, useValue: dateServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dateService = TestBed.inject(DateService) as any;
    globalStore = TestBed.inject(GlobalStore);
  });

  beforeEach(() => {
    globalStore.setTokenExpiry(mockTokenExpiry);
    globalStore.setUserState(OPAL_USER_STATE_MOCK);
    globalStore.setFeatureFlags(DEFAULT_RELEASE_FEATURE_FLAGS);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize launchDarklyFlags and subscribe to launchDarklyFlags$', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(app['launchDarklyService'], 'initializeLaunchDarklyFlags').mockReturnValue(Promise.resolve());

    fixture.detectChanges();

    expect(app['launchDarklyService'].initializeLaunchDarklyFlags).toHaveBeenCalled();
  });

  it('should test handle authentication when authenticated is false', () => {
    globalStore.setAuthenticated(false);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = vi.spyOn<any, any>(component, 'handleRedirect').mockImplementation(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.login;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.login);
  });

  it('should test handle authentication when authenticated is true', () => {
    globalStore.setAuthenticated(true);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spy = vi.spyOn<any, any>(component, 'handleRedirect').mockImplementation(() => {
      mockDocumentLocation.location.href = SSO_ENDPOINTS.logout;
    });

    component.handleAuthentication();

    expect(spy).toHaveBeenCalled();
    expect(mockDocumentLocation.location.href).toBe(SSO_ENDPOINTS.logout);
  });

  it('should unsubscribe from the timeout interval subscription', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'next');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['ngUnsubscribe'], 'complete');

    component.ngOnDestroy();

    expect(component['ngUnsubscribe'].next).toHaveBeenCalled();
    expect(component['ngUnsubscribe'].complete).toHaveBeenCalled();
  });

  it('should show expired warning when remaining minutes is zero', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.mockReturnValue(5);
    dateService.calculateMinutesDifference.mockReturnValue(0);

    component.showExpiredWarning = true;

    fixture.detectChanges();

    expect(component.showExpiredWarning).toBe(true);

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should return early when token expiry is not available', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    globalStore.setTokenExpiry(null as never);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupTimerSubSpy = vi.spyOn<any, any>(component, 'setupTimerSub');

    component['initializeTimeoutInterval']();

    expect(dateService.convertMillisecondsToMinutes).not.toHaveBeenCalled();
    expect(setupTimerSubSpy).not.toHaveBeenCalled();
  });

  it('should handle no expiry case correctly', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    globalStore.setTokenExpiry({ expiry: null, warningThresholdInMilliseconds: 300000 }); // 5 minutes
    dateService.convertMillisecondsToMinutes.mockReturnValue(5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupTimerSubSpy = vi.spyOn<any, any>(
      component as unknown as {
        setupTimerSub: (expiry: string) => void;
      },
      'setupTimerSub',
    );

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    // No timer should be set
    expect(setupTimerSubSpy).not.toHaveBeenCalled();

    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should convert warningThresholdInMilliseconds to minutes', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const expiryTime = DateTime.now().plus({ minutes: 10 }).toISO();
    globalStore.setTokenExpiry({ expiry: expiryTime, warningThresholdInMilliseconds: null });
    dateService.convertMillisecondsToMinutes.mockReturnValue(0);

    component.ngOnInit();
    component['initializeTimeoutInterval']();

    expect(dateService.convertMillisecondsToMinutes).toHaveBeenCalledWith(0);
    expect(component.thresholdInMinutes).toBe(0);

    // Clean up pending timers
    vi.advanceTimersByTime(component['POLL_INTERVAL'] * 1000);
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should set up token expiry and initialize timeout interval', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(of(SESSION_TOKEN_EXPIRY_MOCK));

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should not set up token expiry if sessionService.getTokenExpiry does not emit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).toHaveBeenCalled();
  });

  it('should track page views on navigation end', () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    router.resetConfig([{ path: 'test', component: DummyDashboardRouteComponent }]);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['appInsightsService'], 'logPageView');

    fixture.detectChanges();

    return navigateToUrl(fixture, router, '/test').then(() => {
      expect(component['appInsightsService'].logPageView).toHaveBeenCalledWith('test', '/test');
    });
  });

  it('should fall back to "unknown" when a navigation event has no trailing page segment', () => {
    const logPageView = vi.fn();

    callAppComponentMethod<void>('trackPageViews', {
      platformId: 'browser',
      navigationEnd$: of({
        url: { split: () => ['/test'] },
        urlAfterRedirects: {
          split: () => ({
            pop: () => undefined,
          }),
        },
      }),
      ngUnsubscribe: new Subject<void>(),
      appInsightsService: { logPageView },
    });

    expect(logPageView).toHaveBeenCalledWith('unknown', '/test');
  });

  it('should resolve Search as the active item for the default landing route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['getDashboardTypeFromUrl'](
        `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.search}`,
      ),
    ).toBe('search');
  });

  it('should resolve Search as the active item when dashboard type segment is missing', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['getDashboardTypeFromUrl'](`${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}`),
    ).toBe('search');
  });

  it('should not set an active top-level tab for non-dashboard routes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['getDashboardTypeFromUrl'](
        `${FINES_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.root}/${FINES_DRAFT_ROUTING_PATHS.children.createAndManage}`,
      ),
    ).toBe('');
  });

  it('should not set an active top-level tab for unknown dashboard types', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['getDashboardTypeFromUrl'](`${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/unknown`),
    ).toBe('');
  });

  it('should configure primary navigation to use path-driven mode', () => {
    globalStore.setAuthenticated(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const primaryNavigation = fixture.debugElement.query(By.directive(MojPrimaryNavigationComponent))
      .componentInstance as MojPrimaryNavigationComponent;

    expect(primaryNavigation.useFragmentNavigation).toBe(false);
  });

  it('should hide Reports in primary navigation when the user lacks all report permissions', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Reports');
  });

  it('should show Reports in primary navigation when the user has a report permission in any business unit', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).toContain('Reports');
  });

  it('should hide Reports in primary navigation when release-1c enforcement operational reporting is disabled', () => {
    globalStore.setAuthenticated(true);
    globalStore.setFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false,
    });
    globalStore.setUserState(createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Reports');
  });

  it('should hide Search in primary navigation when the user lacks all search permissions', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Search');
  });

  it('should show Search in primary navigation when the user has a search permission in any business unit', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([SEARCH_PERMISSIONS[0]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).toContain('Search');
  });

  it('should hide Accounts in primary navigation when the user lacks all accounts permissions', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Accounts');
  });

  it('should show Accounts in primary navigation when the user has an accounts permission in any business unit', () => {
    globalStore.setAuthenticated(true);
    globalStore.setUserState(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[1]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).toContain('Accounts');
  });

  it('should hide Accounts in primary navigation when release-1a is disabled and the user only has draft accounts permission', () => {
    globalStore.setAuthenticated(true);
    globalStore.setFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1A_FEATURE_FLAG]: false,
    });
    globalStore.setUserState(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[1]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Accounts');
  });

  it('should show Accounts in primary navigation when release-1c-write-off is enabled and the user has consolidation permission', () => {
    globalStore.setAuthenticated(true);
    globalStore.setFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1A_FEATURE_FLAG]: false,
    });
    globalStore.setUserState(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).toContain('Accounts');
  });

  it('should hide Accounts in primary navigation when release-1c-write-off is disabled and the user only has consolidation permission', () => {
    globalStore.setAuthenticated(true);
    globalStore.setFeatureFlags({ 'release-1a': true, 'release-1c-write-off': false });
    globalStore.setUserState(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(getPrimaryNavigationTexts(fixture)).not.toContain('Accounts');
  });

  it('should show the primary navigation on browse routes', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const browseRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.accounts}`;

    router.resetConfig([
      {
        path: `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.accounts}`,
        component: DummyDashboardRouteComponent,
      },
    ]);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    await navigateToUrl(fixture, router, browseRoute);

    expect(hasPrimaryNavigation(fixture)).toBe(true);
  });

  it('should hide the primary navigation on journey routes such as Create account', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const createAccountRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`;

    router.resetConfig([
      {
        path: `${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
        component: DummyDashboardRouteComponent,
        data: {
          [HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]: true,
        },
      },
    ]);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    await navigateToUrl(fixture, router, createAccountRoute);

    expect(hasPrimaryNavigation(fixture)).toBe(false);
  });

  it('should hide the primary navigation on the first render for deep-linked account journeys', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const addAccountNoteRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    router.resetConfig(getDefendantAccountRoutes());
    window.history.replaceState({}, '', addAccountNoteRoute);

    try {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(hasPrimaryNavigation(fixture)).toBe(false);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(hasPrimaryNavigation(fixture)).toBe(false);
    } finally {
      window.history.replaceState({}, '', currentUrl);
    }
  });

  it('should keep the primary navigation visible on the first render for deep-linked browse routes', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const browseRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    router.resetConfig(getDefendantAccountRoutes());
    window.history.replaceState({}, '', browseRoute);

    try {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(hasPrimaryNavigation(fixture)).toBe(true);

      await fixture.whenStable();
      fixture.detectChanges();

      expect(hasPrimaryNavigation(fixture)).toBe(true);
    } finally {
      window.history.replaceState({}, '', currentUrl);
    }
  });

  it('should hide the primary navigation for nested account journeys such as Add Account Note', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const addAccountNoteRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`;
    router.resetConfig(getDefendantAccountRoutes());

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    await navigateToUrl(fixture, router, addAccountNoteRoute);

    expect(hasPrimaryNavigation(fixture)).toBe(false);
  });

  it('should hide the primary navigation when entering a journey and show it again when returning to browse mode', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    const browseRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details}`;
    const addAccountNoteRoute = `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/123/${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`;

    router.resetConfig(getDefendantAccountRoutes());

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    await navigateToUrl(fixture, router, browseRoute);
    expect(hasPrimaryNavigation(fixture)).toBe(true);

    await navigateToUrl(fixture, router, addAccountNoteRoute);
    expect(hasPrimaryNavigation(fixture)).toBe(false);

    await navigateToUrl(fixture, router, browseRoute);
    expect(hasPrimaryNavigation(fixture)).toBe(true);
  });
  it('should navigate to the selected dashboard type from primary navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onPrimaryNavSelected('reports');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      'reports',
    ]);
  });

  it('should route when primary nav emits navigationItemSelected in path-driven mode', () => {
    globalStore.setAuthenticated(true);
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);
    fixture.detectChanges();

    const primaryNavigation = fixture.debugElement.query(By.directive(MojPrimaryNavigationComponent))
      .componentInstance as MojPrimaryNavigationComponent;
    primaryNavigation.navigationItemSelected.emit('accounts');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      'accounts',
    ]);
  });

  it('should ignore invalid primary navigation selection values', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onPrimaryNavSelected('unknown');

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not perform top-level navigation for search tab fragments', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    component.onPrimaryNavSelected('individuals');

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should keep Search active for search fragments and still allow top-level nav switching', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    const navigateSpy = vi.spyOn(component['router'], 'navigate').mockResolvedValue(true);

    expect(
      component['getDashboardTypeFromUrl'](
        `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.search}#individuals`,
      ),
    ).toBe('search');

    component.onPrimaryNavSelected('finance');

    expect(navigateSpy).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      'finance',
    ]);
  });

  it('should use the router snapshot when computing initial primary nav visibility after navigation', () => {
    const isPrimaryNavigationHiddenSpy = vi.fn().mockReturnValue(true);
    const getCurrentUrlBeforeInitialNavigationSpy = vi.fn();

    const result = callAppComponentMethod<boolean>('getInitialPrimaryNavigationHidden', {
      router: {
        navigated: true,
        routerState: {
          snapshot: {
            root: 'snapshot-root',
          },
        },
      },
      isPrimaryNavigationHidden: isPrimaryNavigationHiddenSpy,
      getCurrentUrlBeforeInitialNavigation: getCurrentUrlBeforeInitialNavigationSpy,
      isPrimaryNavigationHiddenForInitialUrl: vi.fn(),
    });

    expect(result).toBe(true);
    expect(isPrimaryNavigationHiddenSpy).toHaveBeenCalledWith('snapshot-root');
    expect(getCurrentUrlBeforeInitialNavigationSpy).not.toHaveBeenCalled();
  });

  it('should prefer Location.path when determining the current URL before initial navigation', () => {
    const pathSpy = vi.fn().mockReturnValue('/from-location?tab=search#summary');

    const result = callAppComponentMethod<string>('getCurrentUrlBeforeInitialNavigation', {
      location: { path: pathSpy },
      document: {
        location: {
          pathname: '/from-document',
          search: '?from=document',
          hash: '#fragment',
        },
      },
      router: { url: '/from-router' },
    });

    expect(result).toBe('/from-location?tab=search#summary');
    expect(pathSpy).toHaveBeenCalledWith(true);
  });

  it('should fall back to router.url when browser location is unavailable before initial navigation', () => {
    const result = callAppComponentMethod<string>('getCurrentUrlBeforeInitialNavigation', {
      location: { path: vi.fn().mockReturnValue('') },
      document: { location: null },
      router: { url: '/from-router' },
    });

    expect(result).toBe('/from-router');
  });

  it('should hide the primary navigation for MAC and consolidation initial deep links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.root}/${FINES_MAC_ROUTING_PATHS.children.createAccount}`,
      ),
    ).toBe(true);
    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_CON_ROUTING_PATHS.root}/${FINES_CON_ROUTING_PATHS.children.selectBusinessUnit}`,
      ),
    ).toBe(true);
  });

  it('should only hide the primary navigation for supported account journey deep links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root}/123/${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`,
      ),
    ).toBe(true);
    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root}/123/${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details}`,
      ),
    ).toBe(false);
    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.finance}`,
      ),
    ).toBe(false);
    expect(
      component['isPrimaryNavigationHiddenForInitialUrl'](
        `/${FINES_ROUTING_PATHS.root}/${FINES_ACC_ROUTING_PATHS.root}/unknown/123/note/add`,
      ),
    ).toBe(false);
  });

  it('should update document location when handling a redirect', () => {
    const documentLocation = { href: '' };

    callAppComponentMethod<void>('handleRedirect', { document: { location: documentLocation } }, SSO_ENDPOINTS.logout);

    expect(documentLocation.href).toBe(SSO_ENDPOINTS.logout);
  });
  it('should update the active navigation item when the router navigates between dashboard tabs', async () => {
    globalStore.setAuthenticated(true);

    const router = TestBed.inject(Router);
    router.resetConfig([
      {
        path: `${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/:dashboardType`,
        component: DummyDashboardRouteComponent,
      },
    ]);

    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.ngZone!.run(async () => {
      await router.navigateByUrl(
        `/${FINES_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.root}/${FINES_DASHBOARD_ROUTING_PATHS.children.reports}`,
      );
    });
    fixture.detectChanges();

    expect(component.activeNavigationItem()).toBe(FINES_DASHBOARD_ROUTING_PATHS.children.reports);
  });
});

describe('AppComponent - server', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MojHeaderComponent,
        MojHeaderNavigationItemComponent,
        GovukFooterComponent,
        MojAlertComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
  });

  beforeEach(() => {
    mockTokenExpiry.expiry = '2023-07-03T12:30:00Z';
  });

  it('should not initialize LaunchDarkly on server', () => {
    const launchDarklyService = TestBed.inject(LaunchDarklyService);
    const initializeLaunchDarklyClientSpy = vi
      .spyOn(launchDarklyService, 'initializeLaunchDarklyClient')
      .mockImplementation(() => undefined);
    const initializeLaunchDarklyFlagsSpy = vi
      .spyOn(launchDarklyService, 'initializeLaunchDarklyFlags')
      .mockResolvedValue(undefined);
    const initializeLaunchDarklyChangeListenerSpy = vi
      .spyOn(launchDarklyService, 'initializeLaunchDarklyChangeListener')
      .mockImplementation(() => undefined);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(initializeLaunchDarklyClientSpy).not.toHaveBeenCalled();
    expect(initializeLaunchDarklyFlagsSpy).not.toHaveBeenCalled();
    expect(initializeLaunchDarklyChangeListenerSpy).not.toHaveBeenCalled();
  });

  it('should not call getTokenExpiry as on server ', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['sessionService'], 'getTokenExpiry').mockReturnValue(new Observable());

    component['setupTokenExpiry']();

    expect(component['sessionService'].getTokenExpiry).not.toHaveBeenCalled();
  });

  it('should not track page views on server', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn<any, any>(component['appInsightsService'], 'logPageView');

    component.ngOnInit();
    vi.runOnlyPendingTimers();

    expect(component['appInsightsService'].logPageView).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
