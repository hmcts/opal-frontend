import { Injectable, inject } from '@angular/core';
import { TransferStateService, SessionService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly transferStateService = inject(TransferStateService);
  private readonly sessionService = inject(SessionService);

  /**
   * Initializes the SSO (Single Sign-On) enabled state.
   * This method calls the `initializeSsoEnabled` method of the `transferStateService`.
   */
  private initializeSsoEnabled(): void {
    this.transferStateService.initializeSsoEnabled();
  }

  /**
   * Initializes the LaunchDarkly configuration.
   */
  private initializeLaunchDarkly(): void {
    this.transferStateService.initializeLaunchDarklyConfig();
  }

  /**
   * Initializes the application.
   * This method calls the necessary initialization functions.
   */
  public initializeApp(): void {
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();
  }
}
