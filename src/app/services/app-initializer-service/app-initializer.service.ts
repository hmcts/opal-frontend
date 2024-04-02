import { Injectable, inject } from '@angular/core';

import { TransferStateService, LaunchDarklyService, StateService, SessionService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private readonly transferStateService = inject(TransferStateService);
  private readonly sessionService = inject(SessionService);
  private readonly stateService = inject(StateService);
  /**
   * Initializes the user state.
   *
   * @returns A promise that resolves when the user state is initialized.
   */
  private async initializeUserState(): Promise<void> {
    // Convert the observable to a promise, so that we can wait for it to resolve.
    await firstValueFrom(this.sessionService.getUserState());
    // We don't want to to do anything with the returned user state, we just want to wait for it to be set.
    return Promise.resolve();
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
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();

    // We need to wait for this promise to resolve, before starting the application.
    // This is so that we are sure that the LaunchDarkly flags are set before the application starts.

    return Promise.all([this.launchDarklyService.initializeLaunchDarklyFlags(), this.initializeUserState()]);
  }
}
