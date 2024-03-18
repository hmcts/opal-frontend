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
   *
   * @returns A promise that resolves when the initialization is complete.
   */
  private async initializeLaunchDarkly(): Promise<void> {
    this.launchDarklyService.initializeLaunchDarklyClient();
    this.launchDarklyService.initializeLaunchDarklyChangeListener();
  }

  /**
   * Initializes the application.
   *
   * @returns A promise that resolves when the initialization is complete.
   */
  public async initializeApp(): Promise<Promise<void>[]> {
    this.initializeUserState();
    this.initializeLaunchDarkly();
    return [this.launchDarklyService.initializeLaunchDarklyFlags()];
  }
}
