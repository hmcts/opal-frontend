import { Component, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { LaunchDarklyService } from '@services/launch-darkly/launch-darkly.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { SessionService } from '@services/session-service/session.service';
import { DateService } from '@services/date-service/date.service';
import { Observable, Subject, Subscription, from, map, of, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { SsoEndpoints } from '@routing/enums/sso-endpoints';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MojHeaderComponent } from '@components/moj/moj-header/moj-header.component';
import { MojHeaderNavigationItemComponent } from '@components/moj/moj-header/moj-header-navigation-item/moj-header-navigation-item.component';
import { MojBannerComponent } from '@components/moj/moj-banner/moj-banner.component';
import { GovukFooterComponent } from '@components/govuk/govuk-footer/govuk-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MojHeaderComponent,
    MojHeaderNavigationItemComponent,
    MojBannerComponent,
    GovukFooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);
  public readonly sessionService = inject(SessionService);
  public dateService = inject(DateService);
  public minutesRemaining$!: Observable<number>;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private timerSub!: Subscription;
  private readonly ngUnsubscribe = new Subject<void>();

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;
  public thresholdInMinutes!: number;
  public showExpiredWarning = false;

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
    if (!this.globalStateService.tokenExpiry) {
      return;
    }

    const { expiry, warningThresholdInMilliseconds } = this.globalStateService.tokenExpiry;
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
    if (!this.globalStateService.authenticated()) {
      this.handleRedirect(SsoEndpoints.login);
    } else {
      this.handleRedirect(SsoEndpoints.logout);
    }
  }
}
