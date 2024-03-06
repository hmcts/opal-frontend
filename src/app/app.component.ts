import {
  Component,
  Injectable,
  Inject,
  PLATFORM_ID,
  Optional,
  TransferState,
  makeStateKey,
  InjectionToken,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LaunchDarklyService } from './services/launch-darkly/launch-darkly.service';

@Component({
  selector: 'app-root',
  providers: [LaunchDarklyService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'opal-frontend';

  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    @Inject(PLATFORM_ID) private platformId: InjectionToken<Object>,
    @Optional() @Inject('launchDarklyClientId') public launchDarklyClientId: string | null,
    private readonly transferState: TransferState,
    private launchDarklyService: LaunchDarklyService,
  ) {
    const storeKey = makeStateKey<string>('launchDarklyClientIdKey');
    if (isPlatformBrowser(this.platformId)) {
      //get launchDarklyClientId from transferState if browser side
      this.launchDarklyClientId = this.transferState.get(storeKey, null);

      if (this.launchDarklyClientId) {
        this.launchDarklyService.initializeLaunchDarklyClient(this.launchDarklyClientId);
      }
    } else {
      //server side: get provided launchDarklyClientId and store in in transfer state
      this.transferState.set(storeKey, this.launchDarklyClientId);
    }
  }
}
