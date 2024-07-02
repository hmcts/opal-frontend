import { Component, NgZone, OnInit, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { LaunchDarklyService, GlobalStateService, SessionService } from '@services';
import { Observable, from, interval, map, tap } from 'rxjs';
import { SsoEndpoints } from '@enums';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { DateTime } from 'luxon';
import { ITimeRemaining } from './interfaces/time-remaining.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);
  public readonly sessionService = inject(SessionService);
  public timeLeft$!: Observable<ITimeRemaining>;
  private platformId = inject(PLATFORM_ID);

  constructor(private readonly ngZone: NgZone) {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
      if (isPlatformBrowser(this.platformId)) {
        interval(1000)
          // .pipe(map((x) => this.calcDateDiff()))
          .subscribe(() => {
            this.ngZone.run(() => {
              // console.log('running in the zone');
              // here you can handle the result inside Angular zone if needed
              console.log(this.calcDateDiff());
            });
          });
      }
    });

    afterNextRender(() => {
      //Only trigger the render of the component in the browser
      this.sessionService.getTokenExpiry().subscribe((data) => {
        this.globalStateService.sessionTimeout.set(DateTime.fromISO(data));
        this.checkExpiry();
      });
    });
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

  /**
   * Checks the expiry of the session and sets the session timeout warning accordingly.
   */
  private checkExpiry() {
    const expiryTimestamp = this.globalStateService.sessionTimeout();
    // Below would not be commented out
    //const timestamp = DateTime.now();

    // Below is for testing it
    const timestamp = DateTime.now().plus({ hours: 9, minutes: 30 });
    const minutesDifference = expiryTimestamp.diff(timestamp, 'minutes');

    if (minutesDifference.minutes < 30) {
      this.globalStateService.sessionTimeoutWarning.set(true);
      this.calcDateDiff();
    } else {
      this.globalStateService.sessionTimeoutWarning.set(false);
    }
  }

  /**
   * Calculates the time difference between the current date and a specified date.
   * @returns An object containing the remaining seconds and minutes.
   */
  private calcDateDiff(): ITimeRemaining {
    const dDay = this.globalStateService.sessionTimeout().valueOf();
    console.log('dDay', dDay);
    const milliSecondsInASecond = 1000;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const minutes = Math.floor((timeDifference / (milliSecondsInASecond * minutesInAnHour)) % secondsInAMinute);

    const seconds = Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

    return { seconds, minutes };
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
