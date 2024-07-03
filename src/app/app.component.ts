import { Component, NgZone, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { LaunchDarklyService, GlobalStateService, SessionService, UtilsService } from '@services';
import { Observable, Subscription, from, map, of, takeWhile, tap, timer } from 'rxjs';
import { SsoEndpoints } from '@enums';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);
  public readonly sessionService = inject(SessionService);
  public utilsService = inject(UtilsService);
  public minutesRemaining$!: Observable<number>;
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  private timerSub!: Subscription;

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
   * Initializes the timeout interval for checking token expiry.
   * This method is responsible for setting up a timer that periodically checks the remaining time until token expiry.
   * If the token is about to expire, it shows a warning message.
   */
  private initializeTimeoutInterval(): void {
    if (!isPlatformBrowser(this.platformId) || !this.globalStateService.tokenExpiry) {
      return;
    }

    const { expiry, warningThresholdInMilliseconds } = this.globalStateService.tokenExpiry;
    this.thresholdInMinutes = this.utilsService.convertMillisecondsToMinutes(warningThresholdInMilliseconds ?? 0);

    if (!expiry) {
      return;
    }

    const expiryTime = DateTime.fromISO(expiry);
    this.timerSub = timer(0, this.POLL_INTERVAL * 1000)
      .pipe(
        map(() => this.utilsService.calculateMinutesDifference(DateTime.now(), expiryTime)),
        tap((remainingMinutes) => {
          this.ngZone.run(() => {
            this.minutesRemaining$ = of(remainingMinutes);
            this.showExpiredWarning = remainingMinutes === 0;
          });
        }),
        takeWhile((remainingMinutes) => remainingMinutes > 0, true),
      )
      .subscribe();
  }

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * This method is called once after the first `ngOnChanges` method is called.
   */
  ngOnInit(): void {
    from(this.launchDarklyService.initializeLaunchDarklyFlags())
      .pipe(tap(() => this.launchDarklyService.initializeLaunchDarklyChangeListener()))
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
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
  handleAuthentication(): void {
    if (!this.globalStateService.authenticated()) {
      this.handleRedirect(SsoEndpoints.login);
    } else {
      this.handleRedirect(SsoEndpoints.logout);
    }
  }
}
