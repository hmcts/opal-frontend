import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, makeStateKey, Optional, PLATFORM_ID, TransferState } from '@angular/core';
import { initialize, LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService {
  private storedLaunchDarklyClientId: string | null = null;
  ldClient!: LDClient;
  flags!: LDFlagSet;
  // flagChange: Subject<Object> = new Subject<Object>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    @Optional() @Inject('launchDarklyClientId') public launchDarklyClientId: string | null,
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

  public initializeLaunchDarklyClient(): void {
    const key = this.storedLaunchDarklyClientId;
    console.log('LaunchDarkly key:', key);
    if (key) {
      this.ldClient = initialize(key, {
        key: '655ddb56ca6d3c12dea9c518',
        anonymous: true,
      });

      this.ldClient.on('ready', () => {
        console.log('LaunchDarkly client is ready');
      });
    }
  }
}
