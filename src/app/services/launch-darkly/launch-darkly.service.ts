import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Inject,
  Injectable,
  InjectionToken,
  makeStateKey,
  OnDestroy,
  Optional,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { StateService } from '@services';
import { initialize, LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService implements OnDestroy {
  private stateService = inject(StateService);
  private storedLaunchDarklyClientId: string | null = null;
  ldClient!: LDClient;
  // flags!: LDFlagSet;
  // flagChange: Subject<Object> = new Subject<Object>();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: InjectionToken<Object>,
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

  private initializeLaunchDarklyFlags() {
    this.stateService.featureFlags.set(this.ldClient.allFlags());
    console.log('Flags:', this.stateService.featureFlags());
  }

  private initializeLaunchDarklyChangeListener() {
    this.ldClient.on('change', (flags) => {
      this.stateService.featureFlags.set(flags);
      console.log('Change Flags:', this.stateService.featureFlags());
    });
  }

  private initializeLaunchDarklyReadyListener(): void {
    this.ldClient.on('ready', () => {
      this.initializeLaunchDarklyFlags();
    });
  }

  private initializeLaunchDarklyClient(clientId: string): void {
    this.ldClient = initialize(clientId, {
      anonymous: true,
    });
  }

  public initializeLaunchDarkly(): void {
    const clientId = this.storedLaunchDarklyClientId;
    if (clientId) {
      this.initializeLaunchDarklyClient(clientId);
      this.initializeLaunchDarklyReadyListener();
      this.initializeLaunchDarklyChangeListener();
    }
  }

  public closeLaunchDarklyClient(): void {
    if (this.ldClient) this.ldClient.close();
  }

  ngOnDestroy(): void {
    this.closeLaunchDarklyClient();
  }
}
