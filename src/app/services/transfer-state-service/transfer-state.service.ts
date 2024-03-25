import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { IUserState } from '@interfaces';
import { StateService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly stateService = inject(StateService);
  private storedUserState: IUserState | null = null;
  private storedSsoEnabled: boolean | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('ssoEnabled') public readonly ssoEnabled: boolean | null,
    @Optional() @Inject('userState') public readonly userState: IUserState | null,

    private readonly transferState: TransferState,
  ) {
    const storeKeySso = makeStateKey<boolean | null>('ssoEnabled');
    const storeKeyUserState = makeStateKey<IUserState | null>('userState');

    if (isPlatformBrowser(this.platformId)) {
      // get user state from transfer state if browser side
      this.ssoEnabled = this.transferState.get(storeKeySso, null);
      this.storedSsoEnabled = this.ssoEnabled;

      this.userState = this.transferState.get(storeKeyUserState, null);
      this.storedUserState = this.userState;
    } else {
      // server side: get provided user state and store in transfer state
      this.transferState.set(storeKeySso, this.ssoEnabled);
      this.transferState.set(storeKeyUserState, this.userState);
    }
  }

  public initializeSsoEnabled(): void {
    this.stateService.ssoEnabled = this.storedSsoEnabled;
    this.storedSsoEnabled = null;
  }

  public initializeUserState(): void {
    this.stateService.userState = this.storedUserState;
    this.storedUserState = null;
  }
}
