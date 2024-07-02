import { Injectable, inject } from '@angular/core';
import { TransferStateService, SessionService } from '@services';
import { firstValueFrom, from } from 'rxjs';

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
   * Initializes the session timeout.
   *
   * @returns A promise that resolves when the session timeout is initialized.
   */
  private async initializeSessionTimeout(): Promise<void> {
    await firstValueFrom(this.sessionService.getTokenExpiry());
    return Promise.resolve();
  }

  /**
   * Initializes the application.
   * This method calls the necessary initialization functions.
   */
  public async initializeApp(): Promise<void[]> {
    this.initializeSsoEnabled();
    this.initializeLaunchDarkly();
    return Promise.all([this.initializeSessionTimeout()]);
  }
}
