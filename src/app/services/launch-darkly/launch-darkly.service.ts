import { inject, Injectable, OnDestroy } from '@angular/core';
import { initialize, LDClient, LDFlagChangeset, LDFlagSet } from 'launchdarkly-js-client-sdk';
import { GlobalStore } from 'src/app/stores/global/global.store';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private ldClient!: LDClient;

  /**
   * Sets the LaunchDarkly flags by updating the featureFlags in the state service.
   */
  private setLaunchDarklyFlags() {
    if (this.ldClient) {
      this.globalStore.setFeatureFlags(this.ldClient.allFlags());
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
    if (this.ldClient && this.globalStore.launchDarklyConfig().stream) {
      this.ldClient.on('change', (flags: LDFlagChangeset) => {
        const updatedFlags = { ...this.globalStore.featureFlags(), ...this.formatChangeFlags(flags) };
        this.globalStore.setFeatureFlags(updatedFlags);
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
    if (this.globalStore.launchDarklyConfig()) {
      const { enabled, clientId } = this.globalStore.launchDarklyConfig();

      if (enabled && clientId) {
        this.ldClient = initialize(clientId, {
          anonymous: true,
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.closeLaunchDarklyClient();
  }
}
