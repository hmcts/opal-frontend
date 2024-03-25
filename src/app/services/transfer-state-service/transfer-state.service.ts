import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { ILaunchDarklyConfig, IUserState } from '@interfaces';
import { StateService } from '@services';

@Injectable({
  providedIn: 'root',
})
export class TransferStateService {
  private readonly stateService = inject(StateService);
  private storedUserState: IUserState | null = null;
  private storedSsoEnabled: boolean | null = null;
  private storedLaunchDarklyClientId: string | null = null;
  private storedLaunchDarklyStream: boolean | null = null;
  private storedLaunchDarklyEnabled: boolean | null = null;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('ssoEnabled') public readonly ssoEnabled: boolean | null,
    @Optional() @Inject('userState') public readonly userState: IUserState | null,
    @Optional() @Inject('launchDarklyConfig') public readonly launchDarklyConfig: ILaunchDarklyConfig,

    private readonly transferState: TransferState,
  ) {
    const storeKeySso = makeStateKey<boolean | null>('ssoEnabled');
    const storeKeyUserState = makeStateKey<IUserState | null>('userState');

    const storeKeyLdClientId = makeStateKey<string>('launchDarklyClientIdKey');
    const storeKeyLdStream = makeStateKey<boolean>('launchDarklyStreamKey');
    const storeKeyLdEnabled = makeStateKey<boolean>('launchDarklyEnabledKey');

    if (isPlatformBrowser(this.platformId)) {
      // get user state from transfer state if browser side
      this.ssoEnabled = this.transferState.get(storeKeySso, null);
      this.storedSsoEnabled = this.ssoEnabled;

      this.userState = this.transferState.get(storeKeyUserState, null);
      this.storedUserState = this.userState;

      this.launchDarklyConfig = {
        enabled: this.transferState.get(storeKeyLdEnabled, null),
        clientId: this.transferState.get(storeKeyLdClientId, null),
        stream: this.transferState.get(storeKeyLdStream, null),
      };

      this.storedLaunchDarklyClientId = this.launchDarklyConfig.clientId;
      this.storedLaunchDarklyStream = this.launchDarklyConfig.stream;
      this.storedLaunchDarklyEnabled = this.launchDarklyConfig.enabled;
    } else {
      // server side: get provided user state and store in transfer state
      this.transferState.set(storeKeySso, this.ssoEnabled);
      this.transferState.set(storeKeyUserState, this.userState);
      this.transferState.set(storeKeyLdClientId, this.launchDarklyConfig.clientId);
      this.transferState.set(storeKeyLdStream, this.launchDarklyConfig.stream);
      this.transferState.set(storeKeyLdEnabled, this.launchDarklyConfig.enabled);
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

  public initializeLaunchDarklyConfig(): void {
    this.stateService.launchDarklyConfig = {
      clientId: this.storedLaunchDarklyClientId,
      stream: this.storedLaunchDarklyStream,
      enabled: this.storedLaunchDarklyEnabled,
    };

    this.storedLaunchDarklyClientId = null;
    this.storedLaunchDarklyStream = null;
    this.storedLaunchDarklyEnabled = null;
  }
}
