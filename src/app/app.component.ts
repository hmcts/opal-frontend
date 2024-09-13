import { Component, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { LaunchDarklyService } from '@services/launch-darkly/launch-darkly.service';
import { GlobalStateService } from '@services/global-state-service/global-state.service';
import { SessionService } from '@services/session-service/session.service';
import { DateService } from '@services/date-service/date.service';
import { Observable, Subject, Subscription, from, map, of, takeUntil, takeWhile, tap, timer } from 'rxjs';
import { SsoEndpoints } from '@enums/sso-endpoints';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);
  public readonly sessionService = inject(SessionService);
  public dateService = inject(DateService);
  public minutesRemaining$!: Observable<number>;
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private timerSub!: Subscription;
  private ngUnsubscribe = new Subject<void>();

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;
  public thresholdInMinutes!: number;
  public showExpiredWarning = false;

  constructor() {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
      this.initializeTimeoutInterval();
    });
  }

  /**
   * Initializes the timeout interval for token expiry.
   * If the platform is not browser or the token expiry is not available, the method returns early.
   * Otherwise, it sets up the timer subscription based on the expiry time.
   */
  private initializeTimeoutInterval(): void {
    if (!isPlatformBrowser(this.platformId) || !this.globalStateService.tokenExpiry) {
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
