import { Component, NgZone, OnInit, inject } from '@angular/core';
import { LaunchDarklyService, GlobalStateService } from '@services';
import { from, tap } from 'rxjs';
import { SsoEndpoints } from '@enums';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  public readonly globalStateService = inject(GlobalStateService);
  private readonly document = inject(DOCUMENT);

  constructor(private readonly ngZone: NgZone) {
    // There is something odd with the launch darkly lib that requires us to run it outside of the angular zone to initialize
    // https://angular.io/errors/NG0506
    this.ngZone.runOutsideAngular(() => {
      this.launchDarklyService.initializeLaunchDarklyClient();
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
