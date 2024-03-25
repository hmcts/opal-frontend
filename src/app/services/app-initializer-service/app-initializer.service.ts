import { Injectable, inject } from '@angular/core';

import { TransferStateService, LaunchDarklyService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  // private readonly userStateService = inject(UserStateService);
  private readonly transferStateService = inject(TransferStateService);

  /**
   * Initializes the user state.
   */
  private initializeUserState(): void {
    this.transferStateService.initializeUserState();
  }

  /**
   * Initializes the SSO (Single Sign-On) enabled state.
   * This method calls the `initializeSsoEnabled` method of the `transferStateService`.
   */
  private initializeSsoEnabled(): void {
    this.transferStateService.initializeSsoEnabled();
  }

  /**
   * Initializes the LaunchDarkly client and change listener.
   */
  private initializeLaunchDarkly() {
    this.transferStateService.initializeLaunchDarklyConfig();
    this.launchDarklyService.initializeLaunchDarklyClient();
    this.launchDarklyService.initializeLaunchDarklyChangeListener();
  }

  /**
   * Initializes the application.
   *
   * @returns A promise that resolves when the initialization is complete.
   */
  public async initializeApp(): Promise<void[]> {
    this.initializeUserState();
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();

    // We need to wait for this promise to resolve, before starting the application.
    // This is so that we are sure that the LaunchDarkly flags are set before the application starts.

    return Promise.all([this.launchDarklyService.initializeLaunchDarklyFlags()]);
  }
}
