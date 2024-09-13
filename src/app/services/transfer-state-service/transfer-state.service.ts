import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ITransferStateServerState } from './interfaces';
import { GlobalStateService } from '@services/global-state-service/global-state.service';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly globalStateService = inject(GlobalStateService);
  private storedServerTransferState!: ITransferStateServerState;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('serverTransferState') public readonly serverTransferState: ITransferStateServerState | null,
    private readonly transferState: TransferState,
  ) {
    const storeKeyTransferState = makeStateKey<ITransferStateServerState>('serverTransferState');

    if (isPlatformBrowser(this.platformId)) {
      // get user state from transfer state if browser side
      this.serverTransferState = this.transferState.get(storeKeyTransferState, null);

      if (this.serverTransferState) {
        this.storedServerTransferState = this.serverTransferState;
      }
    } else {
      // server side: store server transfer state
      this.transferState.set(storeKeyTransferState, this.serverTransferState);
    }
  }

  /**
   * Initializes the SSO (Single Sign-On) enabled state.
   * Sets the SSO enabled state based on the stored server transfer state.
   */
  public initializeSsoEnabled(): void {
    this.globalStateService.ssoEnabled = this.storedServerTransferState?.ssoEnabled;
  }

  /**
   * Initializes the LaunchDarkly configuration by assigning the stored server transfer state's
   * launchDarklyConfig value to the globalStateService's launchDarklyConfig property.
   */
  public initializeLaunchDarklyConfig(): void {
    this.globalStateService.launchDarklyConfig = this.storedServerTransferState?.launchDarklyConfig;
  }
}
