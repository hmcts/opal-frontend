import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Inject,
  Injectable,
  makeStateKey,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { ILaunchDarklyConfig } from '@interfaces';
import { StateService } from '@services';
import { initialize, LDClient, LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService implements OnDestroy {
  private readonly stateService = inject(StateService);
  private storedLaunchDarklyClientId: string | null = null;
  private storedLaunchDarklyStream: boolean | null = null;
  private storedLaunchDarklyEnabled: boolean | null = null;
  private ldClient!: LDClient;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('launchDarklyConfig') public readonly launchDarklyConfig: ILaunchDarklyConfig,
    private readonly transferState: TransferState,
  ) {
    const storeKey = makeStateKey<string>('launchDarklyClientIdKey');
    const storeStreamKey = makeStateKey<boolean>('launchDarklyStreamKey');
    const storeEnabledKey = makeStateKey<boolean>('launchDarklyEnabledKey');

    if (isPlatformBrowser(this.platformId)) {
      //get launchDarklyClientId and from transferState if browser side
      this.launchDarklyConfig = {
        enabled: this.transferState.get(storeEnabledKey, null),
        clientId: this.transferState.get(storeKey, null),
        stream: this.transferState.get(storeStreamKey, null),
      };

      this.storedLaunchDarklyClientId = this.launchDarklyConfig.clientId;
      this.storedLaunchDarklyStream = this.launchDarklyConfig.stream;
      this.storedLaunchDarklyEnabled = this.launchDarklyConfig.enabled;
    } else {
      //server side: get provided launchDarklyClientId and store in in transfer state
      this.transferState.set(storeKey, this.launchDarklyConfig.clientId);
      this.transferState.set(storeStreamKey, this.launchDarklyConfig.stream);
      this.transferState.set(storeEnabledKey, this.launchDarklyConfig.enabled);
    }
  }

  /**
   * Sets the LaunchDarkly flags by updating the featureFlags in the state service.
   */
  private setLaunchDarklyFlags() {
    if (this.ldClient) {
      this.stateService.featureFlags.set(this.ldClient.allFlags());
    }
  }

  /**
   * Formats the LDFlagChangeset into an LDFlagSet.
   *
   * @param flags - The LDFlagChangeset to be formatted.
   * @returns The formatted LDFlagSet.
   */
  private formatChangeFlags(flags: LDFlagChangeset): LDFlagSet {
    return Object.keys(flags).reduce((flag: LDFlagSet, key) => {
      flag[key] = flags[key].current;
      return flag;
    }, {});
  }

  /**
   * Closes the LaunchDarkly client if it is open.
   */
  private closeLaunchDarklyClient(): void {
    if (this.ldClient) {
      this.ldClient.close();
    }
  }

  /**
   * Initializes the LaunchDarkly change listener.
   * This method listens for changes in feature flags and updates the state accordingly.
   */
  public initializeLaunchDarklyChangeListener() {
    if (this.ldClient && this.storedLaunchDarklyStream) {
      this.ldClient.on('change', (flags: LDFlagChangeset) => {
        const updatedFlags = { ...this.stateService.featureFlags(), ...this.formatChangeFlags(flags) };
        this.stateService.featureFlags.set(updatedFlags);
      });
    }
  }

  /**
   * Initializes the LaunchDarkly flags and sets them.
   * If the LD client is already initialized, it waits for initialization and then sets the flags.
   * If the LD client is not initialized, it returns a resolved promise.
   * @returns A promise that resolves when the flags are set.
   */
  public async initializeLaunchDarklyFlags(): Promise<void> {
    if (this.ldClient) {
      return this.ldClient
        .waitForInitialization()
        .then(() => this.setLaunchDarklyFlags())
        .catch((err) => {
          throw err;
        });
    }

    return Promise.resolve();
  }

  /**
   * Initializes the LaunchDarkly client.
   * If a stored LaunchDarkly client ID exists, it initializes the client with the ID and anonymous mode enabled.
   */
  public initializeLaunchDarklyClient(): void {
    const launchDarklyEnabled = this.storedLaunchDarklyEnabled;
    const clientId = this.storedLaunchDarklyClientId;
    if (launchDarklyEnabled && clientId) {
      this.ldClient = initialize(clientId, {
        anonymous: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.closeLaunchDarklyClient();
  }
}
