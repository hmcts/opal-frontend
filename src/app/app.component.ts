import { Component, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject, DOCUMENT } from '@angular/core';
import { Observable, Subject, Subscription, filter, from, map, of, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import {
  MojHeaderComponent,
  MojHeaderNavigationItemComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-header';
import {
  MojAlertComponent,
  MojAlertContentComponent,
  MojAlertTextComponent,
  MojAlertIconComponent,
} from '@hmcts/opal-frontend-common/components/moj/moj-alert';
import { GovukFooterComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-footer';
import { HEADER_LINKS, FOOTER_LINKS } from '@hmcts/opal-frontend-common/constants';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { SessionService } from '@hmcts/opal-frontend-common/services/session-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { AppInsightsService } from '@hmcts/opal-frontend-common/services/app-insights-service';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';

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
    GovukFooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private timerSub!: Subscription;
  private readonly ngUnsubscribe = new Subject<void>();
  private readonly appInsightsService = inject(AppInsightsService);
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private readonly router = inject(Router);
  private readonly POLL_INTERVAL = 60;

  protected readonly headerLinks = HEADER_LINKS;
  protected readonly footerLinks = FOOTER_LINKS;

  public dateService = inject(DateService);
  public minutesRemaining$!: Observable<number>;
  public thresholdInMinutes!: number;
  public showExpiredWarning = false;
  public readonly sessionService = inject(SessionService);
  public readonly globalStore = inject(GlobalStore);

  constructor() {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
    });
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
    this.timerSub = timer(0, this.POLL_INTERVAL * 1000)
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

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.url.split('#')[0];
        const pageName = event.urlAfterRedirects.split('/').pop() ?? 'unknown';
        this.appInsightsService.logPageView(pageName, currentUrl);
      });
  }

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * This method is called once after the first `ngOnChanges` method is called.
   */
  public ngOnInit(): void {
    from(this.launchDarklyService.initializeLaunchDarklyFlags())
      .pipe(
        tap(() => this.launchDarklyService.initializeLaunchDarklyChangeListener()),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe();
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
    if (!this.globalStore.authenticated()) {
      this.handleRedirect(SSO_ENDPOINTS.login);
    } else {
      this.handleRedirect(SSO_ENDPOINTS.logout);
    }
  }
}
