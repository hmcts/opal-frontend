import { Injectable, inject } from '@angular/core';
import { LaunchDarklyService } from '../launch-darkly/launch-darkly.service';
import { UserStateService } from '../user-state-service/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly launchDarklyService = inject(LaunchDarklyService);
  private readonly userStateService = inject(UserStateService);

  /**
   * Initializes the user state.
   */
  private initializeUserState(): void {
    this.userStateService.initializeUserState();
  }

  /**
   * Initializes the LaunchDarkly client and change listener.
   */
  private async initializeLaunchDarkly() {
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
    this.initializeLaunchDarkly();

    // We need to wait for this promise to resolve, before starting the application.
    // This is so that we are sure that the LaunchDarkly flags are set before the application starts.

    return Promise.all([this.launchDarklyService.initializeLaunchDarklyFlags()]);
  }
}
