import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ITransferStateServerState } from './interfaces/transfer-state-server-state.interface';
import { GlobalStore } from 'src/app/stores/global/global.store';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly globalStore = inject(GlobalStore);
  private readonly storedServerTransferState!: ITransferStateServerState;

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
    this.globalStore.setSsoEnabled(this.storedServerTransferState?.ssoEnabled);
  }

  /**
   * Initializes the LaunchDarkly configuration by assigning the stored server transfer state's
   * launchDarklyConfig value to the globalStore's launchDarklyConfig property.
   */
  public initializeLaunchDarklyConfig(): void {
    this.globalStore.setLaunchDarklyConfig(this.storedServerTransferState?.launchDarklyConfig);
  }
}
