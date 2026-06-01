import { Component, NgZone, OnDestroy, OnInit, PLATFORM_ID, computed, inject, DOCUMENT } from '@angular/core';
import { Observable, Subject, filter, from, map, of, startWith, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  Router,
  RouterOutlet,
  RoutesRecognized,
} from '@angular/router';
import {
  MojHeaderComponent,
  MojHeaderNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-header';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertTextComponent,
  MojAlertIconComponent,
  MojAlertHeadingComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import {
  MojPrimaryNavigationComponent,
  MojPrimaryNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-primary-navigation';
import { GovukFooterComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-footer';
import { HEADER_LINKS, FOOTER_LINKS } from '@hmcts/opal-frontend-common/constants';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { NAVIGATION_BAR_CONFIGURATION } from './constants/navigation-bar-configuration.constant';
import { toSignal } from '@angular/core/rxjs-interop';
import { FINES_ROUTING_PATHS } from './flows/fines/routing/constants/fines-routing-paths.constant';
import { DASHBOARD_PAGE_DEFAULT_TAB } from './pages/dashboard/constants/dashboard-config-default-tab.constant';
import { DashboardPageType } from './pages/dashboard/types/dashboard.type';
import { isDashboardPageType } from './pages/dashboard/constants/dashboard-config.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from './flows/fines/constants/fines-dashboard-routing-paths.constant';
import {
  getAccessiblePrimaryNavigationItems,
  getFeatureFlagReleaseState,
} from './flows/fines/utils/fines-section-permissions.utils';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from './constants/route-data.constant';
import { FINES_ACC_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from './flows/fines/fines-acc/routing/constants/fines-acc-minor-creditor-routing-paths.constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MojHeaderComponent,
    MojHeaderNavigationItemComponent,
    MojAlertComponent,
    MojAlertContentComponent,
    MojAlertTextComponent,
    MojAlertIconComponent,
    MojAlertHeadingComponent,
    GovukFooterComponent,
    MojPrimaryNavigationComponent,
    MojPrimaryNavigationItemComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly location = inject(Location);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly appInsightsService = inject(AppInsightsService);
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private readonly router = inject(Router);
  private readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
  );
  private readonly primaryNavigationRouteEvents$ = this.router.events.pipe(
    filter(
      (event): event is RoutesRecognized | NavigationEnd | NavigationCancel | NavigationError =>
        event instanceof RoutesRecognized ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError,
    ),
  );
  private readonly POLL_INTERVAL = 60;
  private readonly dashboardRouteByType: Record<DashboardPageType, string[]> = {
    search: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.search,
    ],
    accounts: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ],
    finance: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ],
    reports: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ],
    administration: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.administration,
    ],
  };

  protected readonly headerLinks = HEADER_LINKS;
  protected readonly footerLinks = FOOTER_LINKS;

  public dateService = inject(DateService);
  public minutesRemaining$!: Observable<number>;
  public thresholdInMinutes!: number;
  public showExpiredWarning = false;
  public readonly sessionService = inject(SessionService);
  public readonly globalStore = inject(GlobalStore);
  public readonly navigationItems = computed(() =>
    getAccessiblePrimaryNavigationItems(
      NAVIGATION_BAR_CONFIGURATION,
      this.globalStore.userState(),
      getFeatureFlagReleaseState(this.globalStore.featureFlags()),
    ),
  );
  public readonly primaryNavigationHidden = toSignal(
    this.primaryNavigationRouteEvents$.pipe(map((event) => this.getPrimaryNavigationHiddenFromRouterEvent(event))),
    {
      initialValue: this.getInitialPrimaryNavigationHidden(),
    },
  );
  public readonly showPrimaryNavigation = computed(
    () =>
      this.globalStore.authenticated() &&
      this.globalStore.userState().status === 'active' &&
      !this.primaryNavigationHidden(),
  );

  public readonly activeNavigationItem = toSignal(
    this.navigationEnd$.pipe(
      map((event) => this.getDashboardTypeFromUrl(event.urlAfterRedirects)),
      startWith(this.getDashboardTypeFromUrl(this.router.url)),
    ),
    { initialValue: '' },
  );

  constructor() {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.launchDarklyService.initializeLaunchDarklyClient();
      });
    }
  }

  /**
   * Initializes the timeout interval for token expiry.
   * If the platform is not browser or the token expiry is not available, the method returns early.
   * Otherwise, it sets up the timer subscription based on the expiry time.
   */
  private initializeTimeoutInterval(): void {
    if (!this.globalStore.tokenExpiry()) {
      return;
    }

    const { expiry, warningThresholdInMilliseconds } = this.globalStore.tokenExpiry();
    this.thresholdInMinutes = this.dateService.convertMillisecondsToMinutes(warningThresholdInMilliseconds ?? 0);

    if (!expiry) {
      return;
    }

    this.setupTimerSub(expiry);
  }

  /**
   * Sets up a timer subscription to calculate the remaining minutes until the specified expiry time.
   * @param expiry - The expiry time in ISO format.
   */
  private setupTimerSub(expiry: string) {
    const expiryTime = this.dateService.getFromIso(expiry);
    timer(0, this.POLL_INTERVAL * 1000)
      .pipe(
        map(() => this.dateService.calculateMinutesDifference(this.dateService.getDateNow(), expiryTime)),
        tap((remainingMinutes) => {
          this.ngZone.run(() => {
            this.minutesRemaining$ = of(remainingMinutes);
            this.showExpiredWarning = remainingMinutes === 0;
          });
        }),
        takeWhile((remainingMinutes) => remainingMinutes > 0, true),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
  }

  /**
   * Sets up the token expiry mechanism by subscribing to the token expiry observable.
   * When the token expiry event is triggered, it runs the timeout initialization logic outside of Angular's zone.
   * This helps in avoiding unnecessary change detection cycles.
   *
   * @private
   * @returns {void}
   */
  private setupTokenExpiry(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.sessionService
      .getTokenExpiry()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
          this.initializeTimeoutInterval();
        });
      });
  }

  /**
   * Tracks page views and logs them using the AppInsights service.
   * This method sets up a subscription to the router events and listens for `NavigationEnd` events.
   * It prevents execution on the server-side rendering (SSR) by checking the platform ID.
   * When a navigation ends, it extracts the current URL and the page name, then logs the page view.
   *
   * @private
   * @returns {void}
   */
  private trackPageViews(): void {
    if (!isPlatformBrowser(this.platformId)) return; // Prevent SSR execution

    this.navigationEnd$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event: NavigationEnd) => {
      const currentUrl = event.url.split('#')[0];
      const pageName = event.urlAfterRedirects.split('/').pop() ?? 'unknown';
      this.appInsightsService.logPageView(pageName, currentUrl);
    });
  }

  /**
   * Reads the dashboard type from `/fines/dashboard/:dashboardType`.
   * Only falls back to the default tab when `/fines/dashboard` has no type segment.
   * Returns no active tab for non-dashboard routes.
   */
  private getDashboardTypeFromUrl(url: string): DashboardPageType | '' {
    const urlWithoutQueryAndFragment = url.split('#')[0].split('?')[0];
    const segments = urlWithoutQueryAndFragment.split('/').filter(Boolean);

    const finesRootIndex = segments.indexOf(FINES_ROUTING_PATHS.root);
    const isDashboardRoute = finesRootIndex >= 0 && segments[finesRootIndex + 1] === 'dashboard';

    if (!isDashboardRoute) {
      return '';
    }

    const dashboardType = segments[finesRootIndex + 2];

    if (!dashboardType) {
      return DASHBOARD_PAGE_DEFAULT_TAB;
    }

    if (isDashboardPageType(dashboardType)) {
      return dashboardType;
    }

    return '';
  }

  /**
   * Returns true when any active route in the current tree marks the primary navigation as hidden.
   */
  private isPrimaryNavigationHidden(snapshot: ActivatedRouteSnapshot): boolean {
    if (snapshot.data[HIDE_PRIMARY_NAV_ROUTE_DATA_KEY] === true) {
      return true;
    }

    return snapshot.children.some((child) => this.isPrimaryNavigationHidden(child));
  }

  /**
   * Uses route data as soon as Angular has a recognized or activated route tree during navigation.
   */
  private getPrimaryNavigationHiddenFromRouterEvent(
    event: RoutesRecognized | NavigationEnd | NavigationCancel | NavigationError,
  ): boolean {
    if (event instanceof RoutesRecognized) {
      return this.isPrimaryNavigationHidden(event.state.root);
    }

    return this.isPrimaryNavigationHidden(this.router.routerState.snapshot.root);
  }

  /**
   * Falls back to the current URL before the first route tree exists in non-blocking initial navigation.
   */
  private getInitialPrimaryNavigationHidden(): boolean {
    if (this.router.navigated) {
      return this.isPrimaryNavigationHidden(this.router.routerState.snapshot.root);
    }

    return this.isPrimaryNavigationHiddenForInitialUrl(this.getCurrentUrlBeforeInitialNavigation());
  }

  /**
   * Reads the current browser URL before the router has produced an activated route tree.
   */
  private getCurrentUrlBeforeInitialNavigation(): string {
    const locationPath = this.location.path(true);

    if (locationPath) {
      return locationPath;
    }

    const documentLocation = this.document.location;

    if (!documentLocation) {
      return this.router.url;
    }

    return `${documentLocation.pathname}${documentLocation.search}${documentLocation.hash}`;
  }

  /**
   * Uses a narrow, constant-based URL fallback so journey deep links start with the correct shell state
   * before route data is available from the activated router tree.
   */
  private isPrimaryNavigationHiddenForInitialUrl(url: string): boolean {
    const segments = url.split('#')[0].split('?')[0].split('/').filter(Boolean);

    if (segments[0] !== FINES_ROUTING_PATHS.root) {
      return false;
    }

    const featureRoot = segments[1];

    if (
      featureRoot === FINES_ROUTING_PATHS.children.mac.root ||
      featureRoot === FINES_ROUTING_PATHS.children.con.root
    ) {
      return true;
    }

    if (featureRoot !== FINES_ACC_ROUTING_PATHS.root) {
      return false;
    }

    const accountType = segments[2];
    const accountChildRoute = segments[4];

    if (accountType === FINES_ACC_DEFENDANT_ROUTING_PATHS.root) {
      return !!accountChildRoute && accountChildRoute !== FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details;
    }

    if (accountType === FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root) {
      return accountChildRoute === FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note;
    }

    return false;
  }

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * This method is called once after the first `ngOnChanges` method is called.
   */
  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      from(this.launchDarklyService.initializeLaunchDarklyFlags())
        .pipe(
          tap(() => this.launchDarklyService.initializeLaunchDarklyChangeListener()),
          takeUntil(this.ngUnsubscribe),
        )
        .subscribe();
    }
    this.setupTokenExpiry();
    this.trackPageViews();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Handles the redirect
   */
  public handleRedirect(ssoEndpoint: string): void {
    this.document.location.href = ssoEndpoint;
  }

  /**
   * Handles the authentication dependent on whether the user is already authenticated
   */
  public handleAuthentication(): void {
    if (this.globalStore.authenticated()) {
      this.handleRedirect(SSO_ENDPOINTS.logout);
    } else {
      this.handleRedirect(SSO_ENDPOINTS.login);
    }
  }

  /**
   * Handles selection changes from the primary navigation component and routes
   * to the corresponding dashboard URL segment.
   */
  public onPrimaryNavSelected(selection: string): void {
    if (!isDashboardPageType(selection)) {
      return;
    }

    void this.router.navigate(this.dashboardRouteByType[selection]);
  }
}
