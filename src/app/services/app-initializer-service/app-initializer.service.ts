import { Injectable, inject } from '@angular/core';
import { TransferStateService, LaunchDarklyService, SessionService } from '@services';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private readonly transferStateService = inject(TransferStateService);
  private readonly sessionService = inject(SessionService);

  /**
   * Initializes the user state.
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
   * Initializes the LaunchDarkly configuration.
   */
  private initializeLaunchDarkly(): void {
    this.transferStateService.initializeLaunchDarklyConfig();
  }

  /**
   * Initializes the application.
   *
   * @returns A promise that resolves when the initialization is complete.
   */
  public async initializeApp(): Promise<void[]> {
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();

    return Promise.all([this.initializeUserState()]);
  }
}
