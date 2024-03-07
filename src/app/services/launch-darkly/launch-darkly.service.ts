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
import { StateService } from '@services';
import { initialize, LDClient, LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService implements OnDestroy {
  private readonly stateService = inject(StateService);
  private storedLaunchDarklyClientId: string | null = null;
  private ldClient!: LDClient;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: typeof PLATFORM_ID,
    @Optional() @Inject('launchDarklyClientId') public readonly launchDarklyClientId: string | null,
    private readonly transferState: TransferState,
  ) {
    const storeKey = makeStateKey<string>('launchDarklyClientIdKey');
    if (isPlatformBrowser(this.platformId)) {
      //get launchDarklyClientId from transferState if browser side
      this.launchDarklyClientId = this.transferState.get(storeKey, null);

      this.storedLaunchDarklyClientId = this.launchDarklyClientId;
    } else {
      //server side: get provided launchDarklyClientId and store in in transfer state
      this.transferState.set(storeKey, this.launchDarklyClientId);
    }
  }

  /**
   * Initializes the LaunchDarkly flags by setting them in the state service.
   */
  private initializeLaunchDarklyFlags() {
    this.stateService.featureFlags.set(this.ldClient.allFlags());
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
   * Initializes the LaunchDarkly change listener.
   * This method listens for changes in feature flags and updates the state accordingly.
   */
  private initializeLaunchDarklyChangeListener() {
    this.ldClient.on('change', (flags: LDFlagChangeset) => {
      const updatedFlags = { ...this.stateService.featureFlags(), ...this.formatChangeFlags(flags) };
      this.stateService.featureFlags.set(updatedFlags);
    });
  }

  /**
   * Initializes the LaunchDarkly ready listener.
   * When the LaunchDarkly client is ready, it calls the `initializeLaunchDarklyFlags` method.
   */
  private initializeLaunchDarklyReadyListener(): void {
    this.ldClient.on('ready', () => {
      this.initializeLaunchDarklyFlags();
    });
  }

  /**
   * Initializes the LaunchDarkly client with the specified client ID.
   * @param clientId - The client ID to use for initializing the LaunchDarkly client.
   */
  private initializeLaunchDarklyClient(clientId: string): void {
    this.ldClient = initialize(clientId, {
      anonymous: true,
    });

    // Setup our listeners once the client is initialized
    this.initializeLaunchDarklyReadyListener();
    this.initializeLaunchDarklyChangeListener();
  }

  /**
   * Initializes the LaunchDarkly service.
   * If a stored LaunchDarkly client ID is available, it initializes the client,
   * sets up the ready listener, and sets up the change listener.
   */
  public initializeLaunchDarkly(): void {
    const clientId = this.storedLaunchDarklyClientId;
    if (clientId) {
      this.initializeLaunchDarklyClient(clientId);
    }
  }

  /**
   * Closes the LaunchDarkly client if it is open.
   */
  public closeLaunchDarklyClient(): void {
    if (this.ldClient) this.ldClient.close();
  }

  ngOnDestroy(): void {
    this.closeLaunchDarklyClient();
  }
}
