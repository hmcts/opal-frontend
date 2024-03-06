import { Injectable } from '@angular/core';
import { initialize, LDClient, LDFlagSet } from 'launchdarkly-js-client-sdk';
// import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LaunchDarklyService {
  ldClient!: LDClient;
  flags!: LDFlagSet;
  // flagChange: Subject<Object> = new Subject<Object>();

  constructor() {}

  public initializeLaunchDarklyClient() {
    this.ldClient = initialize('sdk-XXXXXXXXXXXXXXXX', {
      anonymous: true,
    });

    this.ldClient.on('ready', () => {
      console.log('LaunchDarkly client is ready');
    });
  }
}
