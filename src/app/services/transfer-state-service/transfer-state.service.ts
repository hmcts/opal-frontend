import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ITransferServerState } from '@interfaces';
import { StateService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly stateService = inject(StateService);
  private storedServerTransferState!: ITransferServerState;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('serverTransferState') public readonly serverTransferState: ITransferServerState | null,
    private readonly transferState: TransferState,
  ) {
    const storeKeyTransferState = makeStateKey<ITransferServerState>('serverTransferState');

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

  public initializeSsoEnabled(): void {
    this.stateService.ssoEnabled = this.storedServerTransferState?.ssoEnabled;
  }

  public initializeUserState(): void {
    this.stateService.userState = this.storedServerTransferState?.userState;
  }

  public initializeLaunchDarklyConfig(): void {
    this.stateService.launchDarklyConfig = this.storedServerTransferState?.launchDarklyConfig;
  }
}
