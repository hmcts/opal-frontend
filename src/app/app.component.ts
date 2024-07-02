import { Component, NgZone, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { LaunchDarklyService, GlobalStateService, SessionService, ExpiryService } from '@services';
import { Observable, from, interval, of, tap } from 'rxjs';
import { SsoEndpoints } from '@enums';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);
  public readonly sessionService = inject(SessionService);
  public expiryService = inject(ExpiryService);
  public minutesRemaining$!: Observable<number>;
  private platformId = inject(PLATFORM_ID);

  // Defined in seconds
  private readonly POLL_INTERVAL = 60;

  constructor(private readonly ngZone: NgZone) {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
      if (isPlatformBrowser(this.platformId) && this.globalStateService.sessionTimeout) {
        interval(this.POLL_INTERVAL * 1000).subscribe(() => {
          this.ngZone.run(() => {
            // here you can handle the result inside Angular zone if needed
            this.minutesRemaining$ = of(this.expiryService.calculateMinuteDifference());
          });
        });
      }
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

    this.expiryService.checkExpiry();
    this.minutesRemaining$ = of(this.expiryService.calculateMinuteDifference());
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
