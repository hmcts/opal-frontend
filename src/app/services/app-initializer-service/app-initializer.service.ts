import { Injectable, inject } from '@angular/core';
import { TransferStateService } from '@services/transfer-state-service/transfer-state.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private readonly transferStateService = inject(TransferStateService);

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
